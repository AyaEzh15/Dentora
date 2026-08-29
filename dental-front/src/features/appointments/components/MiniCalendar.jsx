import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { addMonths, formatMonthLabel, isSameDay, monthCells, startOfMonth } from '@/features/appointments/utils/agenda'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export default function MiniCalendar({ value, onChange }) {
  const [month, setMonth] = useState(() => startOfMonth(value))
  const cells = monthCells(month)

  useEffect(() => {
    setMonth(startOfMonth(value))
  }, [value])
  const today = new Date()

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <IconButton size="small" onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeftRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="overline" sx={{ textTransform: 'uppercase' }}>
          {formatMonthLabel(month)}
        </Typography>
        <IconButton size="small" onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRightRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center', mb: 0.5 }}>
        {WEEKDAYS.map((day, index) => (
          <Typography key={`${day}-${index}`} variant="overline" color="text.secondary">
            {day}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {cells.map((day) => {
          const outside = day.getMonth() !== month.getMonth()
          const selected = isSameDay(day, value)
          const isToday = isSameDay(day, today)

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onChange(day)}
              sx={{
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 13,
                color: outside ? 'outline.main' : selected ? 'primary.contrastText' : 'text.primary',
                bgcolor: selected ? 'primary.main' : 'transparent',
                fontWeight: selected || isToday ? 700 : 400,
                '&:hover': { bgcolor: selected ? 'primary.main' : 'surface.containerLow' },
              }}
            >
              {day.getDate()}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
