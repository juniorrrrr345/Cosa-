'use client';

/**
 * Panel Admin avec intégration Cloudflare complète
 * BIPCOSA06 - Upload direct vers Stream et Images
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dataService, Product } from '@/services/dataService';
import CloudflareUploader from '@/components/CloudflareUploader';

// ==================== STYLES ====================

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: white;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .badge {
    display: inline-block;
    padding: 8px 16px;
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    border: 1px solid #4CAF50;
    border-radius: 20px;
    font-size: 14px;
  }
`;

const FormSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 12px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #4CAF50;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const MediaSection = styled.div`
  margin-top: 30px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  
  h3 {
    margin-bottom: 20px;
    color: #4CAF50;
  }
`;

const PreviewSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  
  h4 {
    margin-bottom: 15px;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const VideoPreview = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ImagePreview = styled.div`
  img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch(props.$variant) {
      case 'danger':
        return `
          background: #f44336;
          color: white;
          &:hover { background: #d32f2f; }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          &:hover { background: rgba(255, 255, 255, 0.2); }
        `;
      default:
        return `
          background: #4CAF50;
          color: white;
          &:hover { background: #45a049; }
        `;
    }
  }}
`;

const ProductsList = styled.div`
  margin-top: 40px;
  
  h2 {
    margin-bottom: 20px;
    color: white;
  }
`;

const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.div`
  width: 200px;
  height: 150px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ProductInfo = styled.div`
  h3 {
    color: white;
    margin-bottom: 8px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
  }
  
  .badges {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    
    .badge {
      padding: 4px 8px;
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
      border-radius: 4px;
      font-size: 12px;
    }
  }
`;

const Notification = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  ${props => {
    switch(props.$type) {
      case 'success':
        return `
          background: rgba(76, 175, 80, 0.9);
          color: white;
        `;
      case 'error':
        return `
          background: rgba(244, 67, 54, 0.9);
          color: white;
        `;
      default:
        return `
          background: rgba(33, 150, 243, 0.9);
          color: white;
        `;
    }
  }}
`;

// ==================== COMPOSANT ====================

export default function AdminPanelCloudflare() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    video: '',
    stock: 0,
    isAvailable: true
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<{
    video?: { url: string; id: string };
    image?: { url: string; id: string; variants?: any };
  }>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await dataService.getProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      showNotification('Erreur lors du chargement des produits', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleVideoUploadSuccess = (data: any) => {
    console.log('Vidéo uploadée:', data);
    setUploadedMedia(prev => ({
      ...prev,
      video: { url: data.url, id: data.id }
    }));
    setFormData(prev => ({
      ...prev,
      video: data.url,
      videoId: data.id,
      videoType: 'cloudflare-stream'
    }));
    showNotification('✅ Vidéo uploadée sur Cloudflare Stream!', 'success');
  };

  const handleImageUploadSuccess = (data: any) => {
    console.log('Image uploadée:', data);
    setUploadedMedia(prev => ({
      ...prev,
      image: { url: data.url, id: data.id, variants: data.variants }
    }));
    setFormData(prev => ({
      ...prev,
      image: data.url,
      imageId: data.id,
      imageVariants: data.variants
    }));
    showNotification('✅ Image uploadée sur Cloudflare Images!', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await dataService.updateProduct(editingProduct.id, productData);
        showNotification('✅ Produit mis à jour avec succès!', 'success');
      } else {
        await dataService.createProduct(productData as Product);
        showNotification('✅ Produit créé avec succès!', 'success');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        video: '',
        stock: 0,
        isAvailable: true
      });
      setEditingProduct(null);
      setUploadedMedia({});
      
      // Recharger les produits
      await loadProducts();
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      showNotification('❌ Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    if (product.video) {
      setUploadedMedia(prev => ({
        ...prev,
        video: { url: product.video!, id: product.videoId || '' }
      }));
    }
    if (product.image) {
      setUploadedMedia(prev => ({
        ...prev,
        image: { url: product.image, id: product.imageId || '', variants: product.imageVariants }
      }));
    }
    window.scrollTo(0, 0);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await dataService.deleteProduct(productId);
        showNotification('✅ Produit supprimé', 'success');
        await loadProducts();
      } catch (error) {
        showNotification('❌ Erreur lors de la suppression', 'error');
      }
    }
  };

  return (
    <AdminContainer>
      {notification && (
        <Notification $type={notification.type}>
          {notification.message}
        </Notification>
      )}

      <Header>
        <h1>🛠️ Panel Admin - BIPCOSA06</h1>
        <div className="badge">✅ Cloudflare intégré</div>
      </Header>

      <FormSection>
        <h2>{editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}</h2>
        
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <div>
              <FormGroup>
                <label>Nom du produit *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Ex: Mousseux USA"
                />
              </FormGroup>

              <FormGroup>
                <label>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée du produit..."
                />
              </FormGroup>

              <FormGroup>
                <label>Prix (€) *</label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Stock *</label>
                <input
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Catégorie</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Premium, Indoor, Outdoor"
                />
              </FormGroup>

              <FormGroup>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                  />
                  {' '}Disponible à la vente
                </label>
              </FormGroup>
            </div>

            <div>
              <MediaSection>
                <h3>📹 Vidéo du produit (Cloudflare Stream)</h3>
                <CloudflareUploader
                  onUploadSuccess={handleVideoUploadSuccess}
                  productName={formData.name}
                  acceptVideo={true}
                  acceptImage={false}
                />
                
                {uploadedMedia.video && (
                  <PreviewSection>
                    <h4>Aperçu vidéo:</h4>
                    <VideoPreview>
                      <iframe
                        src={uploadedMedia.video.url}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="Vidéo produit"
                      />
                    </VideoPreview>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      ID: {uploadedMedia.video.id}
                    </p>
                  </PreviewSection>
                )}
              </MediaSection>

              <MediaSection>
                <h3>🖼️ Image du produit (Cloudflare Images)</h3>
                <CloudflareUploader
                  onUploadSuccess={handleImageUploadSuccess}
                  productName={formData.name}
                  acceptVideo={false}
                  acceptImage={true}
                />
                
                {uploadedMedia.image && (
                  <PreviewSection>
                    <h4>Aperçu image:</h4>
                    <ImagePreview>
                      <img 
                        src={uploadedMedia.image.variants?.medium || uploadedMedia.image.url} 
                        alt="Image produit" 
                      />
                    </ImagePreview>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      ID: {uploadedMedia.image.id}
                    </p>
                  </PreviewSection>
                )}
              </MediaSection>
            </div>
          </FormGrid>

          <ButtonGroup>
            <Button type="submit" $variant="primary">
              {editingProduct ? '💾 Mettre à jour' : '➕ Créer le produit'}
            </Button>
            {editingProduct && (
              <Button 
                type="button" 
                $variant="secondary"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    category: '',
                    image: '',
                    video: '',
                    stock: 0,
                    isAvailable: true
                  });
                  setUploadedMedia({});
                }}
              >
                ❌ Annuler
              </Button>
            )}
          </ButtonGroup>
        </form>
      </FormSection>

      <ProductsList>
        <h2>📦 Produits existants ({products.length})</h2>
        
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage>
              {product.video ? (
                <iframe
                  src={product.video}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)' }}>
                  Pas d'image
                </div>
              )}
            </ProductImage>
            
            <ProductInfo>
              <h3>{product.name}</h3>
              <p>Prix: {product.price}€</p>
              <p>Stock: {product.stock}</p>
              <p>Catégorie: {product.category || 'Non catégorisé'}</p>
              <div className="badges">
                {product.isAvailable ? (
                  <span className="badge">✅ Disponible</span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(244,67,54,0.2)', color: '#f44336' }}>
                    ❌ Indisponible
                  </span>
                )}
                {product.video && <span className="badge">📹 Vidéo</span>}
                {product.image && <span className="badge">🖼️ Image</span>}
              </div>
            </ProductInfo>
            
            <ButtonGroup>
              <Button $variant="secondary" onClick={() => handleEdit(product)}>
                ✏️ Modifier
              </Button>
              <Button $variant="danger" onClick={() => handleDelete(product.id)}>
                🗑️ Supprimer
              </Button>
            </ButtonGroup>
          </ProductCard>
        ))}
      </ProductsList>
    </AdminContainer>
  );
}