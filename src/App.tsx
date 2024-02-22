import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Container,
  Box,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Cards from './components/cards';

import apiRequest from './features/apiRequest';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface items {
  brand: string | null;
  id: string;
  price: number;
  product: string;
}

let brands: Array<string> = [];
let numberOfPages: number;

function App() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Array<items>>();
  const [filters, setFilters] = useState({
    price: undefined,
    product: undefined,
    brand: undefined,
  });

  useEffect(() => {
    async function foo() {
      await apiRequest('get_fields', { field: 'brand' }).then((res) => (brands = Array.from(new Set<string>(res))));
      await apiRequest('get_ids', { limit: 50 })
        .then((res) => apiRequest('get_items', { ids: res }))
        .then((res) => setContent(res));
      await apiRequest('get_ids', {}).then((res) => (numberOfPages = Math.floor(res.length / 50)));
      setLoading(false);
    }
    foo();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    async function foo() {
      setLoading(true);
      await apiRequest('get_ids', { limit: 50 * (page + 1), offset: 50 * page })
        .then((res) => apiRequest('get_items', { ids: res }))
        .then((res) => setContent(res));
      setLoading(false);
    }
    foo();
  }, [page]);

  async function filterHandle() {
    if (!filters.price && !filters.product && !filters.brand) {
      setPage(0);
      return;
    }
    setLoading(true);
    await apiRequest('filter', {
      price: filters.price && +filters.price,
      product: filters.product,
      brand: filters.brand,
      limit: 50,
    })
      .then((res) => apiRequest('get_items', { ids: res }))
      .then((res) => setContent(res));
    setPage(1);
    setLoading(false);
  }

  function onChangeFilter(name: string, val: string) {
    setFilters({ ...filters, [name]: val });
  }

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <ThemeProvider theme={darkTheme}>
      <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '2rem' }}>
        <form action="">
          <Stack spacing={2}>
            <TextField
              value={filters.price}
              onChange={(e) => onChangeFilter('price', e.target.value)}
              type="number"
              id="outlined-basic"
              label="Цена"
              variant="outlined"
            />
            <TextField
              value={filters.product}
              onChange={(e) => onChangeFilter('product', e.target.value)}
              id="outlined-basic"
              label="Имя"
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Бренд</InputLabel>
              <Select value={filters.brand} defaultValue="" onChange={(e) => onChangeFilter('brand', e.target.value)}>
                {brands.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={filterHandle} variant="contained">
              Отфильтровать
            </Button>
          </Stack>
        </form>
        <Cards content={content}></Cards>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBlock: '1rem' }}>
          <Pagination page={page} onChange={(_, val) => setPage(val)} count={numberOfPages} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
