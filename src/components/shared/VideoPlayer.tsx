"use client";
import { useState, useRef, useEffect } from 'react';
import {
    MaximizeIcon,
    MinimizeIcon,
    PauseIcon,
    PlayCircleIcon,
    PlayIcon,
    SlidersHorizontalIcon,
    StepBackIcon,
    StepForwardIcon,
    Volume2Icon,
    VolumeXIcon,
    CheckIcon,
    Loader,
    Loader2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';


interface VideoPlayerProps {
    autoPlay: boolean;
    resolutions: string[];
    title?: string;
};


const VideoPlayer: React.FC<VideoPlayerProps> = ({ resolutions, autoPlay, title }) => {

    const playerRef = useRef<HTMLVideoElement>(null);
    const [showControls, setShowControls] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState<string>(resolutions[0]);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const video = playerRef.current;
        if (!video) return;
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsLoading(false);
            const savedTime = sessionStorage.getItem('videoPlaybackTime');
            if (savedTime !== null) {
                video.currentTime = parseFloat(savedTime);
                setCurrentTime(parseFloat(savedTime));
            }
        };
        const handleVideoPlay = () => {
            setDuration(video.duration);
            setIsPlaying(true);
        };
        const handleVideoPause = () => {
            setIsPlaying(false);
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('play', handleVideoPlay);
            video.removeEventListener('pause', handleVideoPause);
            sessionStorage.removeItem('videoPlaybackTime');
        };
    }, []);

    const handleQualityChange = (quality: string) => {
        if (playerRef.current) {
            sessionStorage.setItem('videoPlaybackTime', playerRef.current.currentTime.toString());
        }
        setIsLoading(true);
        setSelectedQuality(quality);
    };

    const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const [selectedPlaybackSpeed, setSelectedPlaybackSpeed] = useState(playbackSpeedOptions[2]);

    const handlePlaybackSpeedChange = (speed: number) => {
        if (playerRef.current) {
            playerRef.current.playbackRate = speed;
            setSelectedPlaybackSpeed(speed);
        }
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            if (playerRef.current.paused) {
                playerRef.current.play();
                setIsPlaying(true);
            } else {
                playerRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleBackward = () => {
        if (playerRef.current) {
            playerRef.current.currentTime -= 10;
        }
    };

    const handleForward = () => {
        if (playerRef.current) {
            if (playerRef.current.currentTime < playerRef.current.duration) {
                playerRef.current.currentTime += 10;
            }
        }
    };

    const handleVolumeToggle = () => {
        if (playerRef.current) {
            if (volume) {
                playerRef.current.muted = true;
                playerRef.current.volume = 0;
                setVolume(0);
            } else {
                playerRef.current.muted = false;
                playerRef.current.volume = 1;
                setVolume(1);
            }
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setVolume(value);
        if (playerRef.current) {
            playerRef.current.volume = value;
        }
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setCurrentTime(value);
        if (playerRef.current) {
            playerRef.current.currentTime = value;
        }
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div
            className={cn(
                isFullScreen ? "fixed inset-0 z-50 bg-black " : "relative overflow-hidden bg-black rounded-lg",
            )}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {title && (
                <div className={cn(
                    "absolute top-0 left-0 w-full bg-black/25 text-white p-1 md:p-2",
                    showControls ? 'opacity-100' : 'opacity-0'
                )}>
                    <h2 className="text-sm sm:text-lg font-semibold line-clamp-1">{title}</h2>
                </div>
            )}
            <video
                loop={false}
                autoPlay={autoPlay}
                src={selectedQuality}
                ref={playerRef}
                className="w-full h-full rounded-lg bg-black"
            />
            {isLoading ? (
                <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-1 sm:p-4 rounded-md transition-opacity duration-500"}>
                    <div className="flex justify-center items-center">
                        <Loader2 className=' text-white w-10 h-10 animate-spin' />
                    </div>
                </div>
            ) : (
                <div className={cn(
                    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white p-1 sm:p-4 rounded-md transition-opacity duration-500",
                    showControls ? 'opacity-100' : 'opacity-0'
                )}>
                    <div className="flex justify-center items-center">
                        <Button size={'icon'} className='bg-transparent text-white' onClick={handleBackward}>
                            <StepBackIcon />
                        </Button>
                        <Button size={'icon'} className='bg-transparent text-white' onClick={handlePlayPause}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </Button>
                        <Button size={'icon'} className='bg-transparent text-white' onClick={handleForward}>
                            <StepForwardIcon />
                        </Button>
                    </div>
                </div>
            )}
            <div className={cn(
                "absolute bottom-0 w-full bg-black/50 text-white p-1 sm:p-4 transition-opacity duration-500 flex rounded-b-md justify-between",
                showControls ? 'opacity-100' : 'opacity-0'
            )}>
                <div className="w-full">
                    <Input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSliderChange}
                        className="w-full h-1 p-0 bg-transparent"
                    />
                    <div className="flex justify-between items-center mt-1 sm:mt-[10px]">
                        <div className="flex items-center gap-x-1">
                            <Button size={'icon'} className='bg-transparent text-white hidden sm:flex' onClick={handleBackward}>
                                <StepBackIcon />
                            </Button>
                            <Button size={'icon'} className='bg-transparent text-white hidden sm:flex' onClick={handlePlayPause}>
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </Button>
                            <Button size={'icon'} className='bg-transparent text-white hidden sm:flex' onClick={handleForward}>
                                <StepForwardIcon />
                            </Button>
                            <p className='text-xs sm:text-sm'>{formatTime(currentTime)} / {formatTime(duration)}</p>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <Button size={'icon'} className='sm:hidden bg-transparent text-white' onClick={handleVolumeToggle}>
                                {volume === 0 ? <VolumeXIcon /> : <Volume2Icon />}
                            </Button>
                            <div className="hidden sm:flex items-center gap-1">
                                {volume === 0 ? <VolumeXIcon /> : <Volume2Icon />}
                                <Input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01} // Adjust step for smoother volume control
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-28 h-1 p-0 bg-transparent"
                                />
                            </div>
                            <DropdownMenu  >
                                <DropdownMenuTrigger asChild>
                                    <Button size={'icon'} className='bg-transparent text-white'>
                                        <PlayCircleIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={'center'} >
                                    <DropdownMenuLabel>Playback</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {playbackSpeedOptions.map((option, index) => (
                                        <DropdownMenuItem asChild key={index} onClick={() => handlePlaybackSpeedChange(option)}>
                                            <Button variant={'ghost'} className='w-full justify-start' >
                                                {option}x {selectedPlaybackSpeed === option && <CheckIcon className='h-4 w-4 ml-2' />}
                                            </Button>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu  >
                                <DropdownMenuTrigger asChild>
                                    <Button size={'icon'} className='bg-transparent text-white'>
                                        <SlidersHorizontalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={'center'} >
                                    <DropdownMenuLabel>Quality</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {resolutions.map((url, index) => (
                                        <DropdownMenuItem asChild key={index} onClick={() => handleQualityChange(url)}>
                                            <Button variant={'ghost'} className='w-full justify-start'>
                                                {url.split('/').pop()?.split('.')[0]} {selectedQuality === url && <CheckIcon className='h-4 w-4 ml-2' />}
                                            </Button>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size={'icon'} className='bg-transparent text-white' onClick={() => setIsFullScreen(!isFullScreen)}>
                                {isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;