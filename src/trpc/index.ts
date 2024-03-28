//here we are checking if the user is there or not in our dB if not they create one
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { publicProcedure, router } from "./trpx";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  // test: publicProcedure.query(() =>{
  //   return 'hello'
  // })
  authCallback: publicProcedure.query(async () => {
    //here we are checking if the user is there or not in our dB if not they create one
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    //checking if the user is in the dB or not
    // if no then this
    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    //check if the user is in the dB or not
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    //this part is for if they are not in the dB

    if(!dbUser){
      //create user in dB
      await db.user.create({
        data:{
          id: user.id,
          email: user.email
        }
      })
    }

    //if found then this
    return { success: true };
  }),
});
export type AppRouter = typeof appRouter;

//publicProcedure this means everybody can call this regardless they have logIn or Not
