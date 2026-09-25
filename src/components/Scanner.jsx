import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, Upload, Edit3, ShieldAlert, CheckCircle2, AlertTriangle, 
  ExternalLink, Copy, Check, RefreshCw, SwitchCamera, Info, Lock, Zap
} from 'lucide-react';
import { parseQrPayload, QR_TYPES } from '../utils/qrParser';

export default function Scanner({ onStartAnalysis, initialPayload = null }) {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'upload' | 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  
  const [decodedData, setDecodedData] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // If initial payload passed from demo
  useEffect(() => {
    if (initialPayload) {
      handleDecodedText(initialPayload);
    }
  }, [initialPayload]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Listen for clipboard paste on the window
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) processImageFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // CAMERA SCANNING LOGIC
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let message = 'Camera access was denied or device has no camera.';
      if (err.name === 'NotAllowedError') {
        message = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError') {
        message = 'No video capture device was found on this system.';
      }
      setCameraError(message);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  useEffect(() => {
    if (activeMode === 'camera' && !decodedData) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode, facingMode, decodedData]);

  const scanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      stopCamera();
      handleDecodedText(code.data);
      return;
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // IMAGE UPLOAD LOGIC
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    setUploadError(null);
    setIsProcessing(true);

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload a PNG, JPG, JPEG, or WEBP image.');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setIsProcessing(false);
        if (code && code.data) {
          handleDecodedText(code.data);
        } else {
          setUploadError('QR code could not be detected. Try better lighting, higher resolution, or crop closer to the QR code.');
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        setUploadError('Could not process this image file. Please verify it is a valid image.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDecodedText = (text) => {
    const parsed = parseQrPayload(text);
    setDecodedData(parsed);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleDecodedText(manualInput.trim());
  };

  const handleCopy = () => {
    if (!decodedData) return;
    navigator.clipboard.writeText(decodedData.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDecodedData(null);
    setUploadError(null);
    setManualInput('');
    if (activeMode === 'camera') {
      startCamera();
    }
  };

  return (
    <section id="scanner" style={{ padding: '40px 0 60px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            DUAL-ENGINE SCANNER
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '10px' }}>
            QR Code Security Scanner
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Safely inspect QR codes without automated execution. Decode raw payloads and run comprehensive heuristic checks before opening.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {!decodedData && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px'
          }}>
            <button
              onClick={() => setActiveMode('camera')}
              className={`btn ${activeMode === 'camera' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 20px' }}
            >
              <Camera size={18} />
              <span>Camera Scanner</span>
            </button>

            <button
              onClick={() => setActiveMode('upload')}
              className={`btn ${activeMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 20px' }}
            >
              <Upload size={18} />
              <span>Image Upload</span>
            </button>

            <button
              onClick={() => setActiveMode('manual')}
              className={`btn ${activeMode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 20px' }}
            >
              <Edit3 size={18} />
              <span>Manual Input</span>
            </button>
          </div>
        )}

        {/* Main Panel */}
        <div className="glass-panel" style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: '32px',
          borderRadius: '24px'
        }}>
          {/* STATE 1: DECODED PAYLOAD DISPLAY */}
          {decodedData ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
                paddingBottom: '18px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(0, 242, 254, 0.15)',
                    border: '1px solid #00f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={24} color="#00f2fe" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                      QR Content Detected
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                      Decoded safely without automatic execution
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Scan Another</span>
                </button>
              </div>

              {/* Safety notice banner */}
              <div style={{
                background: 'rgba(2, 132, 199, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <Lock size={20} color="#38bdf8" />
                <div style={{ fontSize: '0.86rem', color: '#e2e8f0' }}>
                  <strong>Safety Isolation Active:</strong> QR Shield will never automatically open this URL or submit payment requests. You are in full control.
                </div>
              </div>

              {/* Payload Breakdown Box */}
              <div style={{
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PAYLOAD TYPE:</span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                      {decodedData.type}
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy Raw'}</span>
                  </button>
                </div>

                {/* Raw Content Display */}
                <div style={{
                  background: '#020617',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '10px',
                  padding: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.92rem',
                  color: '#38bdf8',
                  wordBreak: 'break-all',
                  marginBottom: '16px',
                  maxHeight: '180px',
                  overflowY: 'auto'
                }}>
                  {decodedData.raw}
                </div>

                {/* Specialized Metadata Panel per QR Type */}
                {decodedData.type === QR_TYPES.URL && decodedData.metadata && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '8px' }}>
                      <div style={{ color: '#94a3b8' }}>Target Hostname</div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{decodedData.metadata.host}</div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '8px' }}>
                      <div style={{ color: '#94a3b8' }}>Transport Protocol</div>
                      <div style={{ fontWeight: 600, color: decodedData.metadata.protocol === 'HTTPS' ? '#34d399' : '#f59e0b' }}>
                        {decodedData.metadata.protocol}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '8px' }}>
                      <div style={{ color: '#94a3b8' }}>Path Query</div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {decodedData.metadata.pathname}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specialized UPI / Payment Panel */}
                {decodedData.type === QR_TYPES.UPI && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#fbbf24', fontWeight: 700 }}>
                      <AlertTriangle size={18} />
                      <span>Financial Safety Advisory</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.5, marginBottom: '12px' }}>
                      {decodedData.warning}
                    </div>
                    {decodedData.metadata.payeeVpa && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '8px',
                        fontSize: '0.82rem',
                        borderTop: '1px solid rgba(245, 158, 11, 0.3)',
                        paddingTop: '10px'
                      }}>
                        <div><strong style={{ color: '#cbd5e1' }}>Payee Name:</strong> {decodedData.metadata.payeeName}</div>
                        <div><strong style={{ color: '#cbd5e1' }}>VPA Address:</strong> {decodedData.metadata.payeeVpa}</div>
                        <div><strong style={{ color: '#cbd5e1' }}>Requested Amount:</strong> {decodedData.metadata.amount}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action: Trigger Security Analysis */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => onStartAnalysis(decodedData)}
                  className="btn btn-primary"
                  style={{ padding: '14px 36px', fontSize: '1.08rem' }}
                >
                  <Zap size={20} />
                  <span>Analyze Security</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: SCANNER INPUT MODES */
            <div>
              {/* MODE A: CAMERA SCANNER */}
              {activeMode === 'camera' && (
                <div>
                  <div className="scanner-viewport">
                    {cameraError ? (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        textAlign: 'center',
                        background: '#090d16'
                      }}>
                        <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '14px' }} />
                        <h4 style={{ color: '#f87171', marginBottom: '8px', fontSize: '1.1rem' }}>
                          Camera Error
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
                          {cameraError}
                        </p>
                        <button
                          onClick={startCamera}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                        >
                          <RefreshCw size={14} />
                          <span>Retry Camera Access</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {/* Target Reticle & Laser */}
                        <div className="laser-line" />
                        <div className="corner-bracket corner-tl" />
                        <div className="corner-bracket corner-tr" />
                        <div className="corner-bracket corner-bl" />
                        <div className="corner-bracket corner-br" />

                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(3, 7, 18, 0.75)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          color: '#00f2fe',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                          border: '1px solid rgba(0, 242, 254, 0.3)'
                        }}>
                          [ ALIGN QR IN FRAME ]
                        </div>
                      </>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '14px',
                    marginTop: '20px'
                  }}>
                    <button
                      onClick={toggleCameraFacing}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    >
                      <SwitchCamera size={16} />
                      <span>Switch Camera ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MODE B: IMAGE UPLOAD */}
              {activeMode === 'upload' && (
                <div>
                  <div
                    className="dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) processImageFile(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <Upload size={32} color="#00f2fe" />
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                      Drag & Drop QR Image Here
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '14px' }}>
                      Supports PNG, JPG, JPEG, WEBP. Or paste an image with <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>Ctrl + V</kbd>
                    </p>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.88rem', padding: '8px 20px' }}
                    >
                      Browse Device Files
                    </button>
                  </div>

                  {isProcessing && (
                    <div style={{ textAlign: 'center', marginTop: '16px', color: '#00f2fe' }}>
                      <RefreshCw size={18} className="spin-slow" style={{ display: 'inline', marginRight: '8px' }} />
                      Decoding image pixels...
                    </div>
                  )}

                  {uploadError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#f87171',
                      fontSize: '0.85rem'
                    }}>
                      <AlertTriangle size={18} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* MODE C: MANUAL SANDBOX INPUT */}
              {activeMode === 'manual' && (
                <div>
                  <form onSubmit={handleManualSubmit}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '16px' }}>
                      Simulate or test any raw QR payload or suspicious URL directly in the sandbox without needing a camera or physical barcode:
                    </p>

                    <div style={{ marginBottom: '18px' }}>
                      <textarea
                        rows="3"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="e.g. http://secure-paypal-login-verify.top/account/auth/signin?token=928374 or upi://pay?pa=merchant@bank&pn=Shop"
                        style={{
                          width: '100%',
                          background: '#020617',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '12px',
                          padding: '14px',
                          color: '#f8fafc',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.9rem',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!manualInput.trim()}
                        style={{ opacity: !manualInput.trim() ? 0.6 : 1 }}
                      >
                        <CheckCircle2 size={18} />
                        <span>Inspect Payload</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
