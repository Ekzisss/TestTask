import { Card, Typography, Stack } from '@mui/material';

interface items {
  brand: string | null;
  id: string;
  price: number;
  product: string;
}

export default function Cards({ content }: { content: Array<items> | undefined }) {
  return (
    <Stack justifyContent="center" gap="2rem" flexWrap="wrap" direction="row" sx={{ marginTop: '1rem' }}>
      {content?.map((item) => (
        <Card sx={{ width: 350, position: 'relative', paddingBottom: '0.5rem', padding: '1rem' }} variant="outlined">
          <Typography color="primary" variant="h6">
            {item.product}
          </Typography>
          <Typography>{item.brand}</Typography>
          <Typography>{item.price} руб.</Typography>
          <Typography fontSize="0.7rem" sx={{ position: 'absolute', bottom: '4px', right: '4px' }}>
            {item.id}
          </Typography>
        </Card>
      ))}
    </Stack>
  );
}
