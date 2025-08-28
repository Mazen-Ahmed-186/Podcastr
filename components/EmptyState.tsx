import React from 'react'
import {EmptyStateProps} from "@/types";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const EmptyState = ({title, search, buttonLink, buttonText} : EmptyStateProps) => {
    return (
        <section className={"flex items-center justify-center size-full flex-col gap-3"}>
            <Image src={"/icons/emptyState.svg"} alt={"Empty"} width={250} height={250} />
            <div className={"flex items-center justify-center w-full max-w-[254px] flex-col gap-3"}>
                <h1 className={"text-[16px] leading-normal font-medium text-white-1"}>
                    {title}
                </h1>
                {search && (
                    <p className={"text-[16px] leading-normal font-medium text-white-1"}>
                        Try adjusting your search to find what you're looking for
                    </p>
                )}
                {buttonLink && (
                    <Button className={"bg-orange-1 py-4 border-orange-1 hover:bg-black-1 hover:border-2 hover:border-orange-1"}>
                        <Link className={"gap-1 flex"} href={buttonLink}>
                            <Image src={"/icons/discover.svg"} alt={"Discover"} width={20} height={20} />
                            <h1 className={"text-[16px] leading-normal font-bold text-white-1"}>
                                {buttonText}
                            </h1>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}
export default EmptyState
