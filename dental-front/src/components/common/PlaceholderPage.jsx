import { Card, CardContent, Typography } from '@mui/material'
import PageHeader from '@/components/common/PageHeader'

export default function PlaceholderPage({ title }) {
  return (
    <>
      <PageHeader title={title} subtitle="Module à venir" />
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Cette page sera développée dans une prochaine phase. Le menu et les permissions sont
            déjà en place.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
