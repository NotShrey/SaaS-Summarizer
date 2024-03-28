// the perpose of this auth callback is to keep a sync between the user and our DB
"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // const {data,isLoading} = trpc.test.useQuery(); // checking the api response through tRPC as it ensures typeSafety also it is a client query meaning when it will only fire when the api on the client side until then the {data} will be undefined to handeling that we use isLoading

  const query = trpc.authCallback.useQuery(undefined, {
    retry: true, // if there is any Error we retry to login until it is true

    retryDelay: 500, // delay of every retry
  });

  // Check for errors in the query result

  if (query.error) {
    const errData = query.error.data;
    if (errData?.code === "UNAUTHORIZED") {
      // this means the user is a new user and he doesnt have the access to the feature
      router.push("./sign-in"); // so we redirect or re-router him to the sign-in page
    }
  }

  //continue with other logic based on the query result (this means he is an old user so continue on with the flow)

  if (query.data?.success) {
    router.push(origin ? `/${origin}` : "/dashboard"); //if there is a origin the good or else send them to the
  }
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
