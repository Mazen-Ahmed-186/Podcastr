import React, {useState} from 'react'
import {GeneratePodcastProps} from "@/types";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Loader} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {v4 as uuidv4} from "uuid";
import {useUploadFiles} from "@xixixao/uploadstuff/react";
import { toast } from "sonner"

const useGeneratePodcast = ({setAudio, voiceType, voicePrompt, setAudioStorageId} : GeneratePodcastProps) => {

    const [isGenerating, setIsGenerating] = useState(false);

    const generateUploadUrl= useMutation(api.files.generateUploadUrl);

    const {startUpload} = useUploadFiles(generateUploadUrl);

    const getPodcastAudio = useAction(api.openai.generateAudioAction)

    const getAudioUrl = useMutation(api.podcasts.getUrl);

    const generatePodcast = async () => {
        setIsGenerating(true);

        setAudio("");

        if (!voicePrompt) {
            toast("Please provide a voice type to generate a podcast");
            return setIsGenerating(false);
        }
        
        try {
            const response = await getPodcastAudio({
                voice: voiceType,
                input: voicePrompt,
            })

            const blob = new Blob([response], {type: "audio/mpeg"});
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, {type: "audio/mpeg"});

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioUrl = await getAudioUrl({storageId});
            setAudio(audioUrl!);
            setIsGenerating(false);
            toast("Podcast generated successfully!");


        } catch (e) {
            console.error( "Error generating podcast");
            toast("Error creating a podcast");
            setIsGenerating(false);
        }
    }
    return {
        isGenerating,
        generatePodcast
    }
}

const GeneratePodcast = (props : GeneratePodcastProps) => {

    const {isGenerating, generatePodcast} = useGeneratePodcast(props);

    return (
        <div>
            <div className={"flex flex-col gap-2.5"}>
                <Label className={"text-[16px] leading-normal font-bold text-white-1"}>
                    AI prompt to generate podcast
                </Label>
                <Textarea
                    placeholder={"Provide text to generate audio"}
                    rows={5}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                    className={"focus-visible:ring-orange-1 font-light text-[16px] leading-normal placeholder:text-[16px] placeholder:leading-normal bg-black-1 rounded-[6px] placeholder:text-gray-1 border-none text-gray-1"}
                />
            </div>
            <div className={"mt-5 w-full max-w-[200px]"}>
                <Button className={"text-[16px] leading-normal bg-orange-1 py-4 font-bold text-white-1 border-orange-1 hover:bg-black-1 hover:border-2 hover:border-orange-1"}
                        type="submit"
                        onClick={generatePodcast}
                >
                    {isGenerating ? (
                        <>
                            Generating
                            <Loader size={20} className={"animate-spin ml-2"}/>
                        </>
                    ) : (
                        "Generate an Audio"
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio
                    controls
                    src={props.audio}
                    autoPlay
                    className={"mt-5"}
                    onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
                />
            )}
        </div>
    )
}
export default GeneratePodcast
