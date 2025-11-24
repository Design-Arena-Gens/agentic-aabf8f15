'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, Bot, Globe, Code, Cpu, Zap, Play, Settings, History } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system' | 'execution';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'running' | 'completed' | 'error';
}

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'AI Agent Computer initialized. Ready to automate anything using natural language.',
      timestamp: new Date(),
      status: 'completed',
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeModel, setActiveModel] = useState('mixtral-8x7b');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          model: activeModel,
        }),
      });

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: data.response,
        timestamp: new Date(),
        status: 'completed',
      };

      setMessages((prev) => [...prev, agentMessage]);

      if (data.tasks) {
        setTasks(data.tasks);
      }

      if (data.execution) {
        const executionMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'execution',
          content: data.execution,
          timestamp: new Date(),
          status: 'completed',
        };
        setMessages((prev) => [...prev, executionMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Terminal className="w-5 h-5" />;
      case 'agent':
        return <Bot className="w-5 h-5" />;
      case 'execution':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'running':
        return 'border-blue-500 animate-pulse';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-purple-500';
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              AI Agent Computer
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Autonomous Automation System • Natural Language Control • Multi-Model AI
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Terminal className="w-6 h-6 mr-2 text-purple-400" />
                  Command Interface
                </h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={activeModel}
                    onChange={(e) => setActiveModel(e.target.value)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm border border-purple-500"
                  >
                    <option value="mixtral-8x7b">Mixtral 8x7B</option>
                    <option value="llama-2-70b">Llama 2 70B</option>
                    <option value="mistral-7b">Mistral 7B</option>
                    <option value="codellama">CodeLlama</option>
                    <option value="falcon-180b">Falcon 180B</option>
                  </select>
                  <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-purple-400" />
                </div>
              </div>

              {/* Messages */}
              <div className="terminal mb-4 h-96">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 p-3 rounded border-l-4 ${getStatusColor(msg.status)} bg-gray-900/50`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">{getMessageIcon(msg.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 uppercase font-semibold">
                            {msg.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center space-x-2 text-purple-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm">Agent processing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell the AI what to automate... (e.g., 'Open Google and search for AI news')"
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Play className="w-5 h-5 mr-1" />
                  Execute
                </button>
              </form>
            </div>

            {/* Capabilities */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Globe, label: 'Browser Automation', color: 'from-blue-500 to-cyan-500' },
                { icon: Code, label: 'Code Execution', color: 'from-green-500 to-emerald-500' },
                { icon: Cpu, label: 'System Control', color: 'from-purple-500 to-violet-500' },
                { icon: Zap, label: 'API Integration', color: 'from-yellow-500 to-orange-500' },
              ].map((cap, idx) => (
                <div key={idx} className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center hover:scale-105 transition-transform">
                  <cap.icon className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-r ${cap.color} bg-clip-text text-transparent`} style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' }} />
                  <p className="text-xs text-gray-300">{cap.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Tasks */}
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 glow">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-purple-400" />
                Active Tasks
              </h3>
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-gray-400 text-sm">No active tasks</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="bg-gray-900/50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-purple-400">
                          {task.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200">{task.description}</p>
                      {task.result && (
                        <p className="text-xs text-gray-400 mt-1">{task.result}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 glow">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-purple-400" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">AI Model</span>
                  <span className="text-sm font-semibold text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Browser Engine</span>
                  <span className="text-sm font-semibold text-green-400">Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Automation API</span>
                  <span className="text-sm font-semibold text-green-400">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tasks Completed</span>
                  <span className="text-sm font-semibold text-purple-400">{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 glow">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  'Search the web',
                  'Scrape website data',
                  'Generate code',
                  'Run shell commands',
                  'Analyze images',
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(action)}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded text-sm transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Powered by Open Source AI Models • Autonomous Agents • Browser Automation • Full Stack</p>
        </div>
      </div>
    </main>
  );
}
