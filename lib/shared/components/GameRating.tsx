"use client";

import { useState } from "react";
import { Box, HStack, chakra } from "@chakra-ui/react";
import { Rating } from "@lib/shared/components/ui/rating";

interface GameRatingProps {
    game: "case" | "detect" | "mist";
    targetId: string;
}

export function GameRating({ game, targetId }: GameRatingProps) {
    const [hasRated, setHasRated] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);

    const handleRatingChange = async (details: { value: number }) => {
        if (hasRated) return;

        const value = details.value;
        setRatingValue(value);
        setHasRated(true);

        try {
            await fetch("/api/v1/rating", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game, target_id: targetId, score: value }),
            });
        } catch (e) {
            console.error("Failed to submit rating", e);
        }
    };

    return (
        <Box border="1px solid" borderColor="arch.rule" bg="arch.panel" p="14px">
            <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="1.5px" textTransform="uppercase" color="arch.mut" mb="10px">
                为你刚刚的体验打分？
            </chakra.div>
            <HStack align="center" gap={3}>
                <Rating
                    size="lg"
                    colorPalette="orange"
                    value={ratingValue}
                    onValueChange={handleRatingChange}
                    readOnly={hasRated}
                />
                {hasRated && (
                    <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="1px" color="arch.mist">
                        感谢你的评价
                    </chakra.span>
                )}
            </HStack>
        </Box>
    );
}
