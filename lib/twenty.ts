type TwentySaveInput = {
  type: "Property" | "Lead";
  data: {
    title: string;
    description: string;
    price: string | null;
    images: string[];
    url: string;
  };
};

export async function saveToTwenty(input: TwentySaveInput) {
  const apiUrl = process.env.TWENTY_API_URL;
  const apiKey = process.env.TWENTY_API_KEY;

  if (!apiUrl || !apiKey) {
    return {
      saved: false,
      reason: "TWENTY_API_URL or TWENTY_API_KEY is not configured. Preview/logging completed."
    };
  }

  const endpoint = input.type === "Property" ? "/rest/properties" : "/rest/people";
  const payload =
    input.type === "Property"
      ? {
          name: input.data.title,
          title: input.data.title,
          description: input.data.description,
          price: input.data.price,
          sourceUrl: input.data.url,
          imageUrls: input.data.images
        }
      : {
          name: input.data.title,
          linkedinLink: { primaryLinkUrl: input.data.url },
          intro: input.data.description
        };

  const response = await fetch(new URL(endpoint, apiUrl).toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return {
      saved: false,
      reason: `Twenty returned ${response.status}. Create matching custom objects/fields or adjust the endpoint.`
    };
  }

  return {
    saved: true,
    reason: "Saved to Twenty."
  };
}
