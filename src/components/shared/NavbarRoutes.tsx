"use client";
import Link from "next/link";
import Image from "next/image";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import SearchInput from "./SearchInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";

const NavbarRoutes = () => {

    const session = useSession();
    const pathname = usePathname();
    const serachParams = useSearchParams();

    const isCoursePage = pathname?.startsWith("/courses/");
    const isHomePage = pathname === "/";

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSignIn = async (method: 'google') => {
        setIsLoading(true);
        try {
            await signIn(method, {
                redirect: false
            });
            setOpenDialog(false);
        } catch (error) {
            console.log(error);
            toast({
                title: serachParams.get('error') || 'somethiong went wrong.',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isHomePage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isCoursePage ? (
                    <Link href={'/'} >
                        <Button size={'sm'} variant={'outline'} >
                            <LogIn className="mr-2 h-4 w-4" />
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <>
                        {session.status === "authenticated" ? (
                            <>
                                <Image
                                    src={session?.data?.user?.image!}
                                    alt="User image"
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-blue-300 "
                                />
                                <Button onClick={() => signOut()} size={'icon'} variant={'outline'} >
                                    <LogOut className="h-4 w-4 text-rose-500" />
                                </Button>
                            </>
                        ) : (
                            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)} >
                                <Button onClick={() => setOpenDialog(true)} size={'sm'} variant={'outline'}  >
                                    <User className="mr-2 h-4 w-4" />
                                    Sign in
                                </Button>
                                <DialogContent className="max-w-sm" >
                                    <DialogHeader>
                                        <DialogTitle className="text-center" >Sign in</DialogTitle>
                                        <DialogDescription className="text-center" >
                                            To continue to the platform.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="py-4" >
                                        <Button
                                            onClick={() => onSignIn('google')}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-x-2",
                                                isLoading && "cursor-not-allowed"
                                            )}
                                            variant={'outline'}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Image
                                                    src="/google.svg"
                                                    alt="Google logo"
                                                    width={20}
                                                    height={20}
                                                    className="mr-2 h-5 w-5"
                                                />
                                            )}
                                            Continue with google
                                        </Button>
                                    </DialogFooter>
                                    <div className="text-xs text-gray-700 text-center">
                                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default NavbarRoutes;