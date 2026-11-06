const $ = (s) => document.querySelector(s);

const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

function renderMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r/g, "").split("\n");
  const html = [];
  let listType = null;
  let tableRows = [];

  const inline = (value) => esc(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  const closeList = () => {
    if (listType) {
      html.push(listType === "ul" ? "</ul>" : "</ol>");
      listType = null;
    }
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((row) => !row.every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell)));
    if (rows.length) {
      html.push("<div class='answer-table-wrap'><table class='answer-table'><tbody>");
      rows.forEach((row, index) => {
        html.push("<tr>" + row.map((cell) => {
          const tag = index === 0 ? "th" : "td";
          return "<" + tag + ">" + inline(cell.trim()) + "</" + tag + ">";
        }).join("") + "</tr>");
      });
      html.push("</tbody></table></div>");
    }
    tableRows = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      closeList();
      tableRows.push(line.slice(1, -1).split("|"));
      continue;
    }
    flushTable();
    if (!line) { closeList(); continue; }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 2, 5);
      html.push("<h" + level + ">" + inline(heading[2]) + "</h" + level + ">");
    } else if (bullet || numbered) {
      const nextType = bullet ? "ul" : "ol";
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        html.push("<" + listType + ">");
      }
      html.push("<li>" + inline((bullet || numbered)[1]) + "</li>");
    } else {
      closeList();
      html.push("<p>" + inline(line) + "</p>");
    }
  }
  flushTable();
  closeList();
  return html.join("");
}

async function load() {
  try {
    const response = await fetch("/api/summary");
    const data = await response.json();
    $("#revenue").textContent = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(data.revenue || 0));
    $("#count").textContent = data.order_count ?? 0;
    $("#pending").textContent = data.pending ?? 0;
    $("#orders").innerHTML = data.orders.map((o) =>
      "<tr><td>" + esc(o.customer) + "</td><td>" + esc(o.product) +
      "</td><td>" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(o.amount)) +
      "</td><td><span class='tag " + esc(o.status) + "'>" + esc(o.status) +
      "</span></td><td><button data-id='" + Number(o.id) +
      "' data-status='" + esc(o.status) + "'>Update</button></td></tr>"
    ).join("");
  } catch (_) {
    $("#orders").innerHTML = "<tr><td colspan='5'>Could not load orders. Refresh the page.</td></tr>";
  }
}

$("#toggle").onclick = () => {
  $("#orderform").hidden = !$("#orderform").hidden;
};

$("#orderform").onsubmit = async (event) => {
  event.preventDefault();
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(event.target)))
  });
  const data = await response.json();
  if (!response.ok) return alert(data.error || "Could not save order.");
  event.target.reset();
  event.target.hidden = true;
  load();
};

$("#orders").onclick = async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const statuses = ["Pending", "Processing", "Delivered", "Cancelled"];
  const next = prompt("New status: " + statuses.join(", "), statuses[(statuses.indexOf(button.dataset.status) + 1) % statuses.length]);
  if (!statuses.includes(next)) return;
  const response = await fetch("/api/orders/" + button.dataset.id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: next })
  });
  if (!response.ok) return alert("Could not update order.");
  load();
};

$("#chat").onsubmit = async (event) => {
  event.preventDefault();
  const input = $("#question");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.textContent = message;
  $("#messages").append(userBubble);

  const answer = document.createElement("div");
  answer.className = "bubble assistant";
  answer.textContent = "Thinking…";
  $("#messages").append(answer);
  answer.scrollIntoView({ behavior: "smooth", block: "nearest" });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI service unavailable.");
    answer.innerHTML = renderMarkdown(data.reply || "No response");
  } catch (error) {
    answer.textContent = error.message || "Connection error. Try again.";
  }
  answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

load();
