import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  hydrate,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanstackQueryDevtools } from "@adeora/tanstack-query-devtools";

const client = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={client}>
      <div className="App">
        <Devtools />
        <Test />
      </div>
    </QueryClientProvider>
  );
}

const Test = () => {
  const [count, setCount] = useState(1);

  const query = useQuery({
    queryKey: ["pokemon", count],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + count);
      return res.json();
    },
    placeholderData: (prev) => prev,
    select(data) {
      return data.name;
    },
  });

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>Previous</button>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>{count}</p>
      <h1>{query.data ? query.data : "Loading"}</h1>
      <div>{query.isFetching ? "Fetching" : ""}</div>
    </div>
  );
};

const Devtools = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement>(null);
  const devtools = new TanstackQueryDevtools({
    client: queryClient,
    queryFlavor: "React Query",
    version: "5",
  });

  useEffect(() => {
    if (ref.current) {
      devtools.mount(ref.current);
    }

    return () => {
      devtools.unmount();
    };
  }, []);

  return <div ref={ref}></div>;
};

export default App;
