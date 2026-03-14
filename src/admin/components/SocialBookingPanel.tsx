import { useState } from 'react';
import { MessageCircle, Instagram, Send, Bot, CheckCircle, Clock } from 'lucide-react';
import { useSocialBooking, autoReplyTemplates } from '../hooks/useSocialBooking';

// Mock conversation data
const mockConversations = [
  {
    id: 'wa-1',
    channel: 'whatsapp' as const,
    from: '+50688881111',
    name: 'María González',
    messages: [
      { type: 'incoming', text: 'Hola, quiero agendar un facial', time: '10:30 AM' },
      { type: 'outgoing', text: autoReplyTemplates.requestDateTime('Facial Hidratante'), time: '10:31 AM' },
      { type: 'incoming', text: 'Mañana a las 3pm', time: '10:35 AM' },
    ],
    status: 'pending',
    detectedIntent: { service: 'Facial Hidratante', date: 'Mañana', time: '3pm' },
  },
  {
    id: 'ig-1',
    channel: 'instagram' as const,
    from: 'ana_beauty',
    name: 'Ana Rodríguez',
    messages: [
      { type: 'incoming', text: 'Hola! Me interesa la mesoterapia', time: '9:15 AM' },
      { type: 'outgoing', text: autoReplyTemplates.requestDateTime('Mesoterapia Facial'), time: '9:16 AM' },
      { type: 'incoming', text: 'Viernes 10 de marzo a las 11am', time: '9:20 AM' },
      { type: 'outgoing', text: autoReplyTemplates.confirmBooking('Mesoterapia Facial', 'Viernes 10 de marzo', '11am', 85000), time: '9:21 AM' },
    ],
    status: 'waiting_confirmation',
    detectedIntent: { service: 'Mesoterapia Facial', date: 'Viernes 10 de marzo', time: '11am' },
  },
  {
    id: 'wa-2',
    channel: 'whatsapp' as const,
    from: '+50688882222',
    name: 'Carmen Silva',
    messages: [
      { type: 'incoming', text: 'Quiero una cita para radiofrecuencia el lunes', time: 'Ayer' },
      { type: 'outgoing', text: autoReplyTemplates.confirmBooking('Radiofrecuencia', 'Lunes 18 de marzo', '2pm', 65000), time: 'Ayer' },
      { type: 'incoming', text: 'Sí confirmo', time: '8:00 AM' },
    ],
    status: 'confirmed',
    detectedIntent: { service: 'Radiofrecuencia', date: 'Lunes 18 de marzo', time: '2pm' },
  },
];

export function SocialBookingPanel() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [replyText, setReplyText] = useState('');
  useSocialBooking();
  
  const handleSendReply = () => {
    if (!replyText.trim()) return;
    // In real app, this would send the message
    console.log('Sending reply:', replyText);
    setReplyText('');
  };
  
  const handleConfirmBooking = (conversation: typeof mockConversations[0]) => {
    // In real app, this would create the appointment
    console.log('Confirming booking for:', conversation.name);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10 overflow-hidden">
      <div className="p-4 border-b border-beute-taupe/10 bg-beute-cream/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-beute-earth-deep">Agendamiento Automático</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Activo
            </span>
          </div>
        </div>
        <p className="text-sm text-beute-taupe mt-1">
          WhatsApp e Instagram con respuestas automáticas
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 h-[500px]">
        {/* Conversations List */}
        <div className="border-r border-beute-taupe/10 overflow-y-auto">
          <div className="p-3 border-b border-beute-taupe/10">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-beute-earth-deep">
                Conversaciones ({mockConversations.length})
              </span>
            </div>
          </div>
          
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-3 text-left hover:bg-beute-cream/30 transition-colors border-b border-beute-taupe/10 ${
                selectedConversation?.id === conv.id ? 'bg-amber-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  conv.channel === 'whatsapp' ? 'bg-green-100' : 'bg-pink-100'
                }`}>
                  {conv.channel === 'whatsapp' ? (
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Instagram className="w-5 h-5 text-pink-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-beute-earth-deep text-sm truncate">
                      {conv.name}
                    </p>
                    {conv.status === 'confirmed' && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                    {conv.status === 'pending' && (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <p className="text-xs text-beute-taupe truncate">
                    {conv.messages[conv.messages.length - 1]?.text}
                  </p>
                  {conv.detectedIntent && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        {conv.detectedIntent.service}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Chat View */}
        {selectedConversation && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-beute-taupe/10 bg-beute-cream/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-beute-earth-deep">
                    {selectedConversation.name}
                  </span>
                  <span className="text-xs text-beute-taupe">
                    {selectedConversation.from}
                  </span>
                </div>
                {selectedConversation.status !== 'confirmed' && (
                  <button
                    onClick={() => handleConfirmBooking(selectedConversation)}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Confirmar Cita
                  </button>
                )}
              </div>
              {selectedConversation.detectedIntent && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-beute-taupe">Detectado:</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {selectedConversation.detectedIntent.service}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {selectedConversation.detectedIntent.date}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {selectedConversation.detectedIntent.time}
                  </span>
                </div>
              )}
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConversation.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'incoming' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.type === 'incoming'
                        ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                        : 'bg-amber-100 text-amber-900 rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Replies */}
            <div className="p-2 border-t border-beute-taupe/10 bg-beute-cream/10">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['greeting', 'requestDateTime', 'confirmBooking', 'bookingConfirmed'].map((key) => (
                  <button
                    key={key}
                    onClick={() => setReplyText('Plantilla de respuesta...')}
                    className="px-3 py-1.5 bg-white border border-beute-taupe/20 rounded-lg text-xs text-beute-earth-deep hover:border-amber-300 whitespace-nowrap"
                  >
                    {key === 'greeting' ? 'Saludo' : 
                     key === 'requestDateTime' ? 'Pedir fecha' :
                     key === 'confirmBooking' ? 'Confirmar' :
                     key === 'bookingConfirmed' ? 'Cita confirmada' : key}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="p-3 border-t border-beute-taupe/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe una respuesta..."
                  className="flex-1 px-4 py-2 rounded-xl border border-beute-taupe/20 focus:border-amber-500 focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <button
                  onClick={handleSendReply}
                  className="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
