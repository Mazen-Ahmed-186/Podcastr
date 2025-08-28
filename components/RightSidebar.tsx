"use client"

import React from 'react'
import {SignedIn, UserButton, useUser} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import LoaderSpinner from "@/components/LoaderSpinner";
import {useAudio} from "@/providers/AudioProvider";
import {cn} from "@/lib/utils";

const RightSidebar = () => {
    const router = useRouter();
    const {user} = useUser();
    const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
    const {audio} = useAudio();
    if (!topPodcasters) return <LoaderSpinner/>

    return (
        <section className={cn("text-white-1 sticky right-0 top-0 flex w-[310px] flex-col overflow-y-hidden border-none bg-black-1 px-[30px] pt-8 max-xl:hidden", {"h-[calc(100vh-140px)] " : audio?.audioUrl})}>
            <SignedIn>
                <Link href={`/profile/${user?.id}`} className={"flex gap-3 pb-12"}>
                    <UserButton

                    />
                    <div className={"flex w-full items-center justify-between"}>
                        <h1 className={"text-[16px] leading-normal font-semibold truncate text-white-1"}>
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <Image src={"/icons/right-arrow.svg"} alt={"Arrow"} width={24} height={24} />
                    </div>
                </Link>
            </SignedIn>
            <section>
                <Header
                    headerTitle={"Fans Like You"}
                />
                <Carousel fansLikeDetail={topPodcasters!} />
            </section>
            <section className={"flex flex-col gap-8 pt-12"}>
                <Header
                    headerTitle={"Top Podcasters"}
                />
                <div className={"flex flex-col gap-6"}>
                    {topPodcasters?.slice(0,5).map((podcaster) => (
                        <div key={podcaster._id} className={"flex cursor-pointer justify-between"} onClick={() => router.push(`/profile/${podcaster.clerkId}`) }>
                            <figure className={"flex items-center gap-2"}>
                                <Image src={podcaster.imageUrl} alt={podcaster.name} width={44} height={44} className={"aspect-square rounded-lg"}/>
                                <h2 className={"text-[14px] leading-normal font-semibold text-white-1"}>
                                    {podcaster.name}
                                </h2>
                            </figure>
                            <div className={"flex items-center gap-2"}>
                                <p className={"text-[12px] leading-normal font-normal text-white-2"}>
                                    {podcaster.totalPodcasts} podcasts
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    )
}
export default RightSidebar
