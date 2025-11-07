import React from 'react'
import { motion } from 'framer-motion'

export default function Notifications() {
  const items = [
    { id: 1, title: 'Invoice INV-003 overdue', time: '2h ago' },
    { id: 2, title: 'Low stock: Photo Mug', time: '5h ago' },
    { id: 3, title: 'Payment received from Arjun Kumar', time: 'Yesterday' },
  ]

  return (
    <motion.div
      className="p-6 w-full bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <button className="px-3 py-2 border rounded-lg">Mark all as read</button>
      </div>

      <div className="divide-y">
        {items.map((n) => (
          <div key={n.id} className="py-3 flex items-center justify-between">
            <div className="text-gray-800">{n.title}</div>
            <div className="text-gray-500 text-sm">{n.time}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}


