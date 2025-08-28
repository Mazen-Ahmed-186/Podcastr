import React, {useRef, useState} from 'react'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Loader} from "lucide-react";
import {GenerateThumbnailProps} from "@/types";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {toast} from "sonner";
import {v4 as uuidv4} from "uuid";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useUploadFiles} from "@xixixao/uploadstuff/react";

const GenerateThumbnail = ({setImage, setImageStorageId, image, imagePrompt, setImagePrompt} : GenerateThumbnailProps) => {
    const [isAiThumbnail, setIsAiThumbnail] = useState(false);

    const [isImageLoading, setIsImageLoading] = useState(false);

    const imageRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl= useMutation(api.files.generateUploadUrl);

    const {startUpload} = useUploadFiles(generateUploadUrl);

    const getImageUrl = useMutation(api.podcasts.getUrl);

    const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

    const handleImage= async (blob : Blob, fileName : string) => {
        setIsImageLoading(true);
        setImage("");

        try {
            const file = new File([blob], fileName, {type: "image/png"});

            const uploaded = await startUpload([file]);

            const storageId = (uploaded[0].response as any).storageId;

            setImageStorageId(storageId);

            const imageUrl = await getImageUrl({storageId});

            setImage(imageUrl!);

            setIsImageLoading(false);

            toast("Tumbnail Generated Successfully!");

        } catch (e) {
            console.error(e);
            toast("Error generating thumbnail")
        }
    }
    const generateImage = async () => {
        try {
            const response = await handleGenerateThumbnail({prompt : imagePrompt});
            const blob = new Blob([response], { type: "image/png" });
            handleImage(blob, `thumbnail-${uuidv4()}`)
        } catch (e) {
            console.error(e);
            toast("Error generating thumbnail")
        }
    }
    const uploadImage = async (e : React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        try {
            const files = e.target.files;

            if (!files) {
                return;
            }

            const file = files[0];

            const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

            handleImage(blob, file.name);

        } catch (e) {
            console.error(e);
            toast("Error uploading thumbnail")
        }
    }

    return (
        <>
            <div className={"mt-[30px] flex w-full max-w-[520px] flex-col justify-between gap-2 rounded-lg border border-black-6 bg-black-1 px-2.5 py-2 md:flex-row md:gap-0"}>
                <Button
                    type={"button"}
                    variant={"plain"}
                    onClick={() => setIsAiThumbnail(true)}
                    className={cn("", {"bg-black-6" : isAiThumbnail})}
                >
                    Use AI to generate thumbnail
                </Button>
                <Button
                    type={"button"}
                    variant={"plain"}
                    onClick={() => setIsAiThumbnail(false)}
                    className={cn("", {"bg-black-6" : !isAiThumbnail})}
                >
                    Upload custom image
                </Button>
            </div>
            {isAiThumbnail ? (
                <div className={"flex flex-col gap-5"}>
                    <div className={"mt-5 flex flex-col gap-2.5"}>
                        <Label className={"text-[16px] leading-normal font-bold text-white-1"}>
                            AI prompt to generate thumbnail
                        </Label>
                        <Textarea
                            placeholder={"Provide text to generate thumbnail"}
                            rows={5}
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            className={"focus-visible:ring-orange-1 font-light text-[16px] leading-normal placeholder:text-[16px] placeholder:leading-normal bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1"}
                        />
                    </div>
                    <div className={"w-full max-w-[200px]"}>
                        <Button className={"text-[16px] cursor-pointer leading-normal bg-orange-1 py-4 font-bold text-white-1 border-orange-1 hover:bg-black-1 hover:border-2 hover:border-orange-1"}
                                type="submit"
                                onClick={generateImage}
                        >
                            {isImageLoading ? (
                                <>
                                    Generating
                                    <Loader size={20} className={"animate-spin ml-2"}/>
                                </>
                            ) : (
                                "Generate an Image"
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div onClick={() => imageRef?.current?.click()} className={"flex items-center justify-center mt-5 h-[142px] w-full cursor-pointer flex-col gap-3 rounded-xl border-[3.2px] border-dashed border-black-6 bg-black-1"}>
                    <Input
                        type="file"
                        className={"hidden"}
                        ref={imageRef}
                        onChange={(e) => uploadImage(e) }
                    />
                    {!isImageLoading ? (
                        <Image
                            src={"/icons/upload-image.svg"}
                            width={40}
                            height={40}
                            alt={"Upload"}
                        />
                    ): (
                        <div className={"text-[16px] leading-normal flex items-center justify-center font-medium text-white-1"}>
                            Uploading
                            <Loader size={20} className={"animate-spin ml-2"}/>
                        </div>
                    )}
                    <div className={"flex flex-col gap-1 items-center"}>
                        <h2 className={"text-[12px] leading-normal font-bold text-orange-1"}>
                            Click to upload
                        </h2>
                        <p className={"text-[12px] leading-normal font-normal text-gray-1"}>
                            SVG, PNG, JPG, or GIF (max. 1080x1080px)
                        </p>
                    </div>
                </div>
            )}
            {image && (
                <div className={"flex items-center justify-center w-full"}>
                    <Image src={image} width={200} height={200} className={"mt-5"} alt={"thumbnail"} />
                </div>
            )}
        </>
    )
}
export default GenerateThumbnail
