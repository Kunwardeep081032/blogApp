// Reading time calculation logic

export function stripHtmlAndTruncate(content: string) {
    return content.replace(/<\/?[^>]+(>|$)/g, "");
}

interface ReadingTimeResult {
    text: string;
    minutes: number;
    words: number;
    time: number;
    imageTime?: number;
}

export function calculateReadingTime(content: string, imageCount = 0): ReadingTimeResult {
    const wordsPerMinute = 275;
    const roundTo = 1;
    const imageReadingTimeFactor = 0;

    const words = content
        .trim()
        .replace(/[\r\n]+/g, " ")
        .replace(/[ ]+/g, " ")
        .split(" ")
        .filter((word) => word.length > 0);

    const wordCount = words.length;
    const imageTime = (imageCount * imageReadingTimeFactor) / 60;
    const wordsTime = wordCount / wordsPerMinute;
    const totalTime = wordsTime + imageTime;

    const minutes = Number(totalTime.toFixed(roundTo));
    const seconds = Math.ceil(totalTime * 60);

    let readingTimeText = "";
    if (totalTime < 1) {
        readingTimeText = `${seconds} sec`;
    } else {
        readingTimeText = `${minutes} min`;
    }

    return {
        text: readingTimeText,
        minutes,
        words: wordCount,
        time: seconds,
        imageTime: imageTime * 60,
    };
}

export default calculateReadingTime;
