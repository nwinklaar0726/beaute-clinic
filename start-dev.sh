#!/bin/bash

# Start both frontend and backend for development

echo "🚀 Starting Beauté Development Environment"
echo "=========================================="
echo ""

# Check if appointment-bot exists
if [ ! -d "appointment-bot" ]; then
    echo "❌ Error: appointment-bot directory not found"
    exit 1
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start Backend
echo "📦 Starting Backend (appointment-bot)..."
cd appointment-bot

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: appointment-bot/.env not found"
    echo "   Copy .env.example to .env and configure"
fi

npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend (Vite)..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env not found"
    echo "   Copy .env.example to .env and configure"
fi

npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo "   Admin:    http://localhost:3000 (admin panel)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
