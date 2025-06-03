const path = import.meta.env.GRAPHQL_API as string;

function graphql(query: string) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
}

export default graphql;
