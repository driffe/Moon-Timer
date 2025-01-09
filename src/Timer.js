import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const Timer = () => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('30');
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  
  const timerRef = useRef(null);

  const validateTimeInput = (value, max) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) return '00';
    num = Math.min(Math.max(0, num), max);
    return num.toString().padStart(2, '0');
  };

  const handleInputChange = (e, setter, max) => {
    const value = validateTimeInput(e.target.value, max);
    setter(value);
  };

  const calculateTotalSeconds = () => {
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  const startTimer = () => {
    if (remainingSeconds === 0) {
      const total = calculateTotalSeconds();
      if (total > 0) {
        setTotalSeconds(total);
        setRemainingSeconds(total);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHours('00');
    setMinutes('00');
    setSeconds('30');
    setRemainingSeconds(0);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  // Generate random stars
  const generateStars = (count) => {
    const stars = [];
    const centerX = 130;
    const centerY = 130;
    const moonRadius = 70; 

    while (stars.length < count) {
      const x = Math.random() * 240 + 10;
      const y = Math.random() * 240 + 10;
      
      // 달 중심으로부터의 거리 계산
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      
      // 달 반경보다 멀리 있는 경우에만 별 추가
      if (distance > moonRadius) {
        stars.push({
          x,
          y,
          opacity: Math.random() * 0.5 + 0.3,
          size: Math.random() * 1.5 + 0.5,
          key: stars.length
        });
      }
    }
    return stars;
  };

  const stars = generateStars(20);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-grey">
      {/* Moon Animation Container */}
      <div className="relative w-64 h-64 mb-6 border-2">
        <svg width="260" height="260" viewBox="0 0 260 260">
          {/* Stars */}
          {stars.map(star => (
            <circle
              key={star.key}
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill="#FFFFFF"
              opacity={star.opacity}
              className="animate-pulse"
            />
          ))}

          {/* Moon */}
          {/* Moon base circle - outline */}
          <circle cx="130" cy="130" r="60" fill="transparent" stroke="#333" strokeWidth="1" />
          
          <path
            d={`
                M 130 70
                A 60 60 0 1 0 130 190
                A ${progress > 50 ? ((progress-50)*2/100 * 60) : 60 - (progress*2/100 * 60)} 60 0 0 ${progress > 50 ? 1 : 0} 130 70
            `}
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Timer Display */}
      <div className="mb-3 text-2xl text-gray-400">
        {Math.floor(remainingSeconds / 3600).toString().padStart(2, '0')}:
        {Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0')}:
        {(remainingSeconds % 60).toString().padStart(2, '0')}
      </div>

      {/* Time Input */}
      <div className="flex gap-0 mb-6">
        <input
          type="text"
          value={hours}
          onChange={(e) => handleInputChange(e, setHours, 23)}
          className="w-16 p-1 text-center bg-transparent text-white border-b border-gray-600 text-lg"
          placeholder="00"
        />
        <text className="w-4 p-1 text-center bg-transparent text-white border-b border-gray-600">
          :
        </text>
        <input
          type="text"
          value={minutes}
          onChange={(e) => handleInputChange(e, setMinutes, 59)}
          className="w-16 p-1 text-center bg-transparent text-white border-b border-gray-600 text-lg"
          placeholder="00"
        />
        <text className="w-4 p-1 text-center bg-transparent text-white border-b border-gray-600">
          :
        </text>
        <input
          type="text"
          value={seconds}
          onChange={(e) => handleInputChange(e, setSeconds, 59)}
          className="w-16 p-1 text-center bg-transparent text-white border-b border-gray-600 text-lg"
          placeholder="30"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={isRunning ? stopTimer : startTimer}
          className="p-2 text-white hover:text-gray-300"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 text-white hover:text-gray-300"
        >
          <RefreshCw size={24} />
        </button>
      </div>

    </div>
  );
};

export default Timer;