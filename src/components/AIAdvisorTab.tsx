import React, { useState, useRef } from "react";
import { Sparkles, Send, UploadCloud, FileImage, ShieldAlert, Check, HelpCircle, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { ChatMessage } from "../types";

export default function AIAdvisorTab() {
  const [chatMode, setChatMode] = useState<"chat" | "scan">("chat");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your YieldWise AI Portfolio Advisor, powered by high-reasoning intelligence. I can analyze tax-equivalent yields, optimize your parameters, or run scenario analyses. What financial objective can I help you formulate today?",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Collapsible reasoning logs for chat
  const [expandedReasoningMap, setExpandedReasoningMap] = useState<Record<string, boolean>>({});

  // Image analysis state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // File Upload Drag and Drop states
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample chat queries
  const sampleQueries = [
    "Verify the tax equivalence of a 92% CDI LCI vs a 110% CDI CDB.",
    "Recommend a custom fixed-income scenario for R$ 10,000 initial + R$ 500/month.",
    "Is a fixed 10.5% p.a. CRA better than Tesouro Selic given the current 10.75% rate?",
  ];

  // Sample image scanning prompts
  const sampleScanPrompts = [
    "Scan this statement and cross-reference its yields with the current 10.75% Selic.",
    "Extract the performance history from this chart image and list key numbers.",
    "Identify if there are any hidden management or transaction fees on this statement.",
  ];

  // Helper to handle chat submission
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isChatLoading) return;

    if (!textToSend) {
      setInputMessage("");
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      // Proxy request to Express server `/api/chat`
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to contact the high-thinking advisor engine.");
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.text || "I apologize, but my high-reasoning engine encountered an issue formulating a response.",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isThinking: true, // Tag as high-reasoning for expander
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: `Error: ${err.message || "An unexpected issue occurred while processing your request."}`,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper to convert File to Base64
  const handleFileConvert = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Event Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileConvert(e.dataTransfer.files[0]);
    }
  };

  // Image scan submit handler
  const handleAnalyzeImage = async () => {
    if (!selectedImage || isScanLoading) return;

    // Extract raw base64 data from DataURL
    const base64Data = selectedImage.split(",")[1];
    setIsScanLoading(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: base64Data,
          mimeType: imageMimeType,
          prompt: imagePrompt || "Analyze this financial statement and summarize the performance.",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to complete deep statement scanner analysis.");
      }

      const data = await res.json();
      setScanResult(data.text);
    } catch (err: any) {
      setScanResult(`**Analysis Failure:** ${err.message || "An issue occurred reading the file."}`);
    } finally {
      setIsScanLoading(false);
    }
  };

  // Format advisor response into collapsible segments (collapsible "Thinking" logs)
  const toggleReasoning = (id: string) => {
    setExpandedReasoningMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Control Pane / Left side (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Mode Selector */}
        <div className="bg-surface-card border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Advisor Hub</h2>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Select an operational mode to interact with our Gemini-3.1-pro intelligence pipeline.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setChatMode("chat")}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                chatMode === "chat"
                  ? "bg-primary text-on-primary shadow-md shadow-primary/10"
                  : "bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              <span>1. AI Portfolio Chat</span>
              <span className="text-[9px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                Thinking On
              </span>
            </button>

            <button
              onClick={() => setChatMode("scan")}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                chatMode === "scan"
                  ? "bg-primary text-on-primary shadow-md shadow-primary/10"
                  : "bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              <span>2. Statement Scanner</span>
              <span className="text-[9px] bg-tertiary text-on-primary px-2 py-0.5 rounded-full font-bold">
                Image Vision
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Panel */}
        {chatMode === "chat" ? (
          <div className="bg-surface-card border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Quick Suggestions
            </h3>
            <div className="flex flex-col gap-2">
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(query)}
                  className="text-left text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container p-2.5 rounded-lg border border-outline-variant transition-all leading-relaxed font-medium"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-card border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Statement Scans
            </h3>
            <div className="flex flex-col gap-2">
              {sampleScanPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagePrompt(prompt)}
                  className="text-left text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container p-2.5 rounded-lg border border-outline-variant transition-all leading-relaxed font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Interaction Workspace (8 cols) */}
      <div className="lg:col-span-8">
        {chatMode === "chat" ? (
          /* AI CHAT VIEW */
          <div className="bg-surface-card border border-outline-variant rounded-xl flex flex-col h-[520px] shadow-sm overflow-hidden">
            <div className="bg-surface-container/50 p-4 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="font-display text-sm font-bold text-on-surface">
                  Advisor Chat (Gemini-3.1-pro)
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                Thinking Level: High
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                const isExpanded = expandedReasoningMap[m.id] || false;
                
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${
                      isAssistant ? "self-start items-start" : "self-end items-end ml-auto"
                    }`}
                  >
                    {isAssistant && m.isThinking && (
                      <div className="mb-1.5 w-full">
                        <button
                          onClick={() => toggleReasoning(m.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[10px] font-bold tracking-wider text-on-surface-variant uppercase transition-all"
                        >
                          <Layers className="w-3.5 h-3.5 text-primary" />
                          <span>{isExpanded ? "Hide Advisor Reasoning" : "Show Advisor Reasoning"}</span>
                        </button>
                        {isExpanded && (
                          <div className="mt-1.5 p-3 rounded-lg bg-surface-container border border-outline-variant font-mono text-[10.5px] text-on-surface-variant leading-relaxed max-w-full">
                            <span className="text-primary font-bold block mb-1">
                              [AI Deep Thinking Process]
                            </span>
                            Analyzed portfolio values, interest rates, tax tables, and compared asset structures dynamically using Gemini pro preview reasoning mechanisms with high thinking level parameter.
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                        isAssistant
                          ? "bg-surface-container text-on-surface rounded-tl-none border border-outline-variant"
                          : "bg-primary text-on-primary rounded-tr-none font-medium"
                      }`}
                    >
                      {/* Standard Render (with support for basic formatting) */}
                      <p className="whitespace-pre-line">{m.content}</p>
                    </div>

                    <span className="text-[9px] font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex flex-col items-start gap-1 max-w-[80%]">
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-surface-container text-on-surface-variant text-xs font-semibold rounded-tl-none border border-outline-variant animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span>Deep Financial Reasoning Active...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-outline-variant bg-surface-container/30 flex gap-2">
              <input
                type="text"
                placeholder="Ask about allocation, liquidity, inflation adjustments..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-grow px-4 py-2.5 border border-outline-variant rounded-lg outline-none bg-surface-card text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isChatLoading}
                className="bg-primary hover:bg-primary-dark text-on-primary p-2.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STATEMENT SCANNER VIEW */
          <div className="bg-surface-card border border-outline-variant rounded-xl p-6 flex flex-col gap-6 shadow-sm min-h-[520px]">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <h2 className="font-display text-base font-bold text-on-surface">Statement Vision Scanner</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                Gemini Vision
              </span>
            </div>

            {/* Drag and Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-outline-variant hover:border-primary bg-surface-container/50 hover:bg-surface-container"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileConvert(e.target.files[0]);
                  }
                }}
                className="hidden"
                accept="image/*"
              />

              {selectedImage ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded Statement Thumbnail"
                    className="w-32 h-32 object-contain rounded-lg border border-outline-variant bg-surface-card p-1 shadow-sm"
                  />
                  <span className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
                    <Check className="w-4 h-4" /> Document Selected
                  </span>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-surface-card rounded-full shadow-sm text-on-surface-variant">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-on-surface">Drag &amp; Drop statement image here</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">or click to browse local storage</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
                    Supports PNG, JPG, or WEBP up to 10MB
                  </span>
                </>
              )}
            </div>

            {/* Question Input */}
            <div className="space-y-2">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">
                Analysis Instruction
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter specific questions or instructions for the scanning engine (e.g., 'Verify management fees', 'Compare yields')..."
                rows={3}
                className="w-full border border-outline-variant rounded-lg p-3 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/10 focus:border-primary bg-surface-container/30"
              />
            </div>

            {/* Scan triggers */}
            <div className="flex gap-4">
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setScanResult(null);
                  }}
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  Clear Image
                </button>
              )}
              <button
                onClick={handleAnalyzeImage}
                disabled={!selectedImage || isScanLoading}
                className="flex-grow py-3 px-6 bg-primary hover:bg-primary-dark text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isScanLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Deep Vision Scanning...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Vision Analysis
                  </>
                )}
              </button>
            </div>

            {/* Scanned Result */}
            {scanResult && (
              <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3 animate-fade-in mt-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                <h3 className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" /> Scanned Insights Report
                </h3>
                <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
                  {scanResult}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
