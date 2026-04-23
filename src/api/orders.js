const baseApiUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

function buildOrdersEndpoint() {
  if (!baseApiUrl) {
    throw new Error(
      "Missing API configuration. Set VITE_API_BASE_URL in the frontend environment.",
    );
  }

  return `${baseApiUrl.replace(/\/$/, "")}/order`;
}

export async function placeOrder(payload) {
  const response = await fetch(buildOrdersEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  let data = {};

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Order request failed.");
  }

  return data;
}
