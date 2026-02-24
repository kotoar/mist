"use client";

import { useState } from "react";
import { VStack, Text, HStack } from "@chakra-ui/react";
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
        <VStack align="stretch" p={4} borderWidth="1px" borderRadius="md" bg="bg.muted">
            <Text fontWeight="bold">为您刚刚的体验打分？</Text>
            <HStack align="center" gap={3}>
                <Rating
                    size="lg"
                    colorPalette="orange"
                    value={ratingValue}
                    onValueChange={handleRatingChange}
                    readOnly={hasRated}
                />
                {hasRated && <Text color="green.500" fontSize="sm">感谢您的评价！</Text>}
            </HStack>
        </VStack>
    );
}
