import React, { useEffect, useRef, useState } from 'react';

const Whiteboard = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      isDrawing.current = true;
      const { x, y } = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';

      socket.emit('whiteboard:draw', { 
        roomId, 
        x, 
        y, 
        isStart: true,
        color,
        size: brushSize
      });
    };

    const stopDrawing = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      ctx.beginPath();

      const canvasState = canvas.toDataURL();
      socket.emit('whiteboard:update', { roomId, canvasState });
    };

    const draw = (e) => {
      if (!isDrawing.current) return;

      const { x, y } = getCoords(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      socket.emit('whiteboard:draw', { 
        roomId, 
        x, 
        y, 
        isStart: false,
        color,
        size: brushSize
      });
    };

    socket.on('whiteboard:draw', ({ x, y, isStart, color, size }) => {
      if (isStart) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color || '#000';
        ctx.lineWidth = size || 3;
        ctx.lineCap = 'round';
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    });

    socket.on('whiteboard:update', ({ canvasState }) => {
      const image = new Image();
      image.src = canvasState;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      };
    });

    socket.on('whiteboard:sync', ({ canvasState }) => {
      const image = new Image();
      image.src = canvasState;
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    socket.emit('whiteboard:request-sync', { roomId });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);

      socket.off('whiteboard:draw');
      socket.off('whiteboard:update');
      socket.off('whiteboard:sync');
    };
  }, [socket, roomId, color, brushSize]);

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('whiteboard:clear', { roomId });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '70vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eaeaea'
      }}>
        <h2 style={{
          margin: 0,
          color: '#333',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Collaborative Whiteboard
        </h2>
        <button 
          onClick={() => setShowControls(!showControls)}
          style={{
            padding: '6px 12px',
            backgroundColor: showControls ? '#f0f0f0' : '#4a6bff',
            color: showControls ? '#333' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '12px 20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderBottom: '1px solid #eaeaea'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ 
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>Color:</label>
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ 
                width: '30px', 
                height: '30px', 
                cursor: 'pointer',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                padding: 0
              }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ 
              fontWeight: '500',
              fontSize: '14px',
              color: '#555'
            }}>Size:</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              style={{ 
                width: '100px',
                cursor: 'pointer'
              }}
            />
            <span style={{ 
              minWidth: '30px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {brushSize}px
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
            <button 
              onClick={clearWhiteboard}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background 0.2s ease',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff7875'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4d4f'}
            >
              Clear Board
            </button>
            
            <button 
              onClick={downloadCanvas}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4a6bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background 0.2s ease',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6b85ff'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a6bff'}
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Canvas Area */}
      <div style={{ 
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'crosshair'
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;