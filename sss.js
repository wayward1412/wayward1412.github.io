import React, { useEffect, useRef } from 'react';

const AudioVisualizer = () => {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const audio = audioRef.current;
        const ctx = canvas.getContext('2d');

        // 绘制矩形长条的函数
        const drawRect = (x, y, width, height) => {
            ctx.fillStyle = 'blue';
            ctx.fillRect(x, y, width, height);
        };

        // 初始化音频上下文
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // 音频数据处理函数
        const processAudio = () => {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray); // 获取声波数据

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                drawRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            requestAnimationFrame(processAudio);
        };

        // 开始音频可视化
        audio.play();
        processAudio();

        return () => {
            // 组件卸载时停止音频可视化并关闭音频上下文
            audio.pause();
            audioContext.close();
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} />
            <audio ref={audioRef} src="your_audio_file.mp3" controls />
        </div>
    );
};

export default AudioVisualizer;
