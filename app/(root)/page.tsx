"use client";
import React from 'react'
import {podcastData} from "@/constants";
import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";



const Home = () => {
    const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

    return (
        <div className={"mt-9 flex flex-col gap-9 md:overflow-hidden "}>
            <section className={"flex flex-col gap-5"}>
                <h1 className={"text-[20px] leading-normal font-bold text-white-1"}>
                    Trending Podcasts
                </h1>

                <div className={"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"}>
                    {trendingPodcasts?.map(({_id, imageUrl, podcastTitle, podcastDescription}) => (
                        <PodcastCard
                            key={_id}
                            imgUrl={imageUrl!}
                            title={podcastTitle}
                            description={podcastDescription}
                            podcastId={_id}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
export default Home
