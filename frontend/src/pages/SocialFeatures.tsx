import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Group,
  Share,
  ThumbUp,
  Comment,
  Star,
  Send,
  TrendingUp,
  LocalOffer,
  ShoppingCart,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface SocialPost {
  id: number;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  type: 'deal' | 'tip' | 'review' | 'question';
  product?: string;
  store?: string;
  price?: number;
  savings?: number;
  rating?: number;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  joined: boolean;
}

const SocialFeatures: React.FC = () => {
  const { formatCurrency } = useLanguage();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postDialog, setPostDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Mock social data
    setPosts([
      {
        id: 1,
        user: { name: 'María González', avatar: 'MG', verified: true },
        content: '¡Increíble oferta en Walmart! Encontré leche Lala a $18.90 cuando normalmente cuesta $23.50. ¡Corrí por 6 botellas! 🥛',
        type: 'deal',
        product: 'Leche Lala 1L',
        store: 'Walmart',
        price: 18.90,
        savings: 4.60,
        likes: 24,
        comments: 8,
        timestamp: '2024-07-20T14:30:00Z',
        liked: false,
      },
      {
        id: 2,
        user: { name: 'Carlos Ruiz', avatar: 'CR', verified: false },
        content: 'Tip del día: Siempre revisen los precios por kilogramo, no por paquete. A veces el paquete más grande no es el más económico.',
        type: 'tip',
        likes: 18,
        comments: 5,
        timestamp: '2024-07-20T12:15:00Z',
        liked: true,
      },
      {
        id: 3,
        user: { name: 'Ana López', avatar: 'AL', verified: true },
        content: 'Reseña de Pan Bimbo Integral: Muy buena calidad y duración. Lo recomiendo especialmente cuando está en oferta en Chedraui.',
        type: 'review',
        product: 'Pan Bimbo Integral',
        store: 'Chedraui',
        rating: 4.5,
        likes: 12,
        comments: 3,
        timestamp: '2024-07-20T10:45:00Z',
        liked: false,
      },
    ]);

    setCommunities([
      {
        id: 1,
        name: 'Ofertas CDMX',
        description: 'Comparte las mejores ofertas de supermercados en Ciudad de México',
        members: 1250,
        category: 'Ofertas',
        joined: true,
      },
      {
        id: 2,
        name: 'Cocina Económica',
        description: 'Recetas económicas y consejos para ahorrar en la cocina',
        members: 890,
        category: 'Recetas',
        joined: false,
      },
      {
        id: 3,
        name: 'Mamás Ahorradoras',
        description: 'Consejos de ahorro para familias mexicanas',
        members: 2100,
        category: 'Familia',
        joined: true,
      },
    ]);
  }, []);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleJoinCommunity = (communityId: number) => {
    setCommunities(communities.map(community =>
      community.id === communityId
        ? { 
            ...community, 
            joined: !community.joined,
            members: community.joined ? community.members - 1 : community.members + 1
          }
        : community
    ));
  };

  const handleAddToShoppingList = (post: any) => {
    // Extract product information from the deal post
    const productName = post.content.match(/([A-Za-z\s]+)/)?.[0]?.trim() || 'Producto de oferta';
    
    // This would normally integrate with your shopping list API
    alert(`"${productName}" agregado a tu lista de compras`);
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'deal': return <LocalOffer color="error" />;
      case 'tip': return <TrendingUp color="info" />;
      case 'review': return <Star color="warning" />;
      default: return <Comment color="primary" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Group color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Comunidad BiteBudget
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comparte ofertas, tips y experiencias con otros usuarios
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Share />}
          onClick={() => setPostDialog(true)}
        >
          Publicar
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Feed Principal" />
          <Tab label="Comunidades" />
          <Tab label="Mis Publicaciones" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {/* Social Feed */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actividad Reciente
              </Typography>
              
              <List>
                {posts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {post.user.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {post.user.name}
                            </Typography>
                            {post.user.verified && (
                              <Chip label="Verificado" size="small" color="primary" />
                            )}
                            {getPostIcon(post.type)}
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(post.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body1" paragraph>
                              {post.content}
                            </Typography>
                            
                            {post.product && (
                              <Box mb={2}>
                                <Chip
                                  label={post.product}
                                  variant="outlined"
                                  icon={<ShoppingCart />}
                                  sx={{ mr: 1 }}
                                />
                                {post.store && (
                                  <Chip
                                    label={post.store}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              </Box>
                            )}
                            
                            {post.price && (
                              <Box mb={2}>
                                <Typography variant="h6" color="primary" component="span">
                                  {formatCurrency(post.price)}
                                </Typography>
                                {post.savings && (
                                  <Chip
                                    label={`Ahorro: ${formatCurrency(post.savings)}`}
                                    color="success"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                            )}
                            
                            {post.rating && (
                              <Box mb={2}>
                                <Rating value={post.rating} readOnly size="small" />
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  {post.rating}/5
                                </Typography>
                              </Box>
                            )}
                            
                            <Box display="flex" alignItems="center" gap={2}>
                              <Button
                                size="small"
                                startIcon={<ThumbUp />}
                                color={post.liked ? 'primary' : 'inherit'}
                                onClick={() => handleLike(post.id)}
                              >
                                {post.likes}
                              </Button>
                              
                              <Button
                                size="small"
                                startIcon={<Comment />}
                                color="inherit"
                              >
                                {post.comments}
                              </Button>
                              
                              <Button
                                size="small"
                                startIcon={<Share />}
                                color="inherit"
                              >
                                Compartir
                              </Button>
                              
                              {post.type === 'deal' && (
                                <Button
                                  size="small"
                                  startIcon={<ShoppingCart />}
                                  color="inherit"
                                  onClick={() => handleAddToShoppingList(post)}
                                >
                                  Añadir a la lista
                                </Button>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < posts.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {/* Communities */}
          <Typography variant="h6" gutterBottom>
            Comunidades Recomendadas
          </Typography>
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
            {communities.map((community) => (
              <Card key={community.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {community.name}
                      </Typography>
                      <Chip
                        label={community.category}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Button
                      variant={community.joined ? 'outlined' : 'contained'}
                      size="small"
                      onClick={() => handleJoinCommunity(community.id)}
                    >
                      {community.joined ? 'Salir' : 'Unirse'}
                    </Button>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {community.description}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    {community.members.toLocaleString()} miembros
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Mis Publicaciones
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                Aún no has publicado nada. ¡Comparte tu primera oferta o tip!
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* New Post Dialog */}
      <Dialog open={postDialog} onClose={() => setPostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nueva Publicación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué quieres compartir con la comunidad?"
            sx={{ mt: 1 }}
          />
          
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Tipo de publicación:
            </Typography>
            <Box display="flex" gap={1}>
              <Chip label="Oferta" icon={<LocalOffer />} clickable />
              <Chip label="Tip" icon={<TrendingUp />} clickable />
              <Chip label="Reseña" icon={<Star />} clickable />
              <Chip label="Pregunta" icon={<Comment />} clickable />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            disabled={!newPost.trim()}
            onClick={() => {
              // Handle post creation
              setPostDialog(false);
              setNewPost('');
            }}
          >
            Publicar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SocialFeatures;
