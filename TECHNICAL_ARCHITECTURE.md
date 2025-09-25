# BiteBudget V2 - Technical Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  React Web App (TypeScript)  │  Mobile App (React Native)     │
│  • Material-UI Components    │  • Native Camera Integration   │
│  • Real-time WebSocket       │  • Offline Sync Capability     │
│  • Progressive Web App       │  • Push Notifications          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                            ┌───────▼───────┐
                            │  Load Balancer │
                            │  (Azure ALB)   │
                            └───────┬───────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Azure API Management                                           │
│  • Rate Limiting           • Authentication                     │
│  • Request Routing         • Response Caching                  │
│  • API Versioning          • Analytics & Monitoring            │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                   Microservices Layer                          │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │   User      │ │   Receipt   │ │  Analytics  │ │   Pricing   │ │
│ │  Service    │ │   Service   │ │   Service   │ │   Service   │ │
│ │ (Flask)     │ │ (Flask+OCR) │ │ (Python+ML) │ │ (AsyncIO)   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │Notification │ │  Shopping   │ │  Social     │ │  Delivery   │ │
│ │  Service    │ │   Service   │ │  Service    │ │  Service    │ │
│ │ (Node.js)   │ │  (Flask)    │ │ (Flask)     │ │ (FastAPI)   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ PostgreSQL  │ │    Redis    │ │ ClickHouse  │ │    Blob     │ │
│ │ (Primary)   │ │   (Cache)   │ │ (Analytics) │ │  Storage    │ │
│ │             │ │             │ │             │ │ (Files)     │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                 External Services                              │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Walmart API │ │Chedraui API │ │ Soriana API │ │  Azure ML   │ │
│ │             │ │             │ │             │ │   Service   │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Distributed Architecture Components

### 1. Frontend Layer (Client-Side)

#### React Web Application

```typescript
// Tech Stack
- React 18 with TypeScript
- Material-UI v5 for design system
- React Router v6 for navigation
- Axios for API communication
- Socket.io for real-time updates
- Recharts for data visualization
- QuaggaJS for barcode scanning
```

#### Key Components

- **Authentication**: JWT-based with refresh tokens
- **Real-time Updates**: WebSocket connections for live pricing
- **Offline Support**: Service workers for PWA functionality
- **Mobile Responsive**: Adaptive UI for all screen sizes

### 2. API Gateway & Load Balancing

#### Azure API Management

```yaml
# API Gateway Configuration
gateway:
  policies:
    - rate_limiting: 1000/hour per user
    - authentication: JWT validation
    - cors: Cross-origin enabled
    - caching: Response caching for static data

  routing:
    - /api/auth/* -> User Service
    - /api/receipts/* -> Receipt Service
    - /api/analytics/* -> Analytics Service
    - /api/pricing/* -> Pricing Service
```

### 3. Microservices Architecture

#### User Service (Authentication & Profile)

```python
# Technology: Flask + SQLAlchemy
# Responsibilities:
- User registration and authentication
- Profile management
- JWT token generation and validation
- User preferences and settings
- GDPR compliance and data privacy
```

#### Receipt Service (OCR & Data Processing)

```python
# Technology: Flask + Tesseract OCR
# Responsibilities:
- Receipt image upload and processing
- OCR text extraction
- Product categorization using ML
- Barcode scanning integration
- Receipt data validation and correction
```

#### Analytics Service (ML & Insights)

```python
# Technology: Python + scikit-learn + TensorFlow
# Responsibilities:
- Spending pattern analysis
- ML model training and inference
- Predictive analytics
- Recommendation generation
- Statistical reporting
```

#### Real-time Pricing Service

```python
# Technology: FastAPI + AsyncIO
# Responsibilities:
- Multi-store price fetching
- Real-time price comparison
- Price alert management
- Historical price tracking
- ML-based price prediction
```

### 4. Database Architecture

#### Primary Database (PostgreSQL)

```sql
-- User and transactional data
Tables:
- users (authentication, profiles)
- receipts (scanned receipt data)
- receipt_items (individual products)
- budgets (user budget settings)
- price_alerts (user price tracking)
- shopping_lists (planned purchases)

-- Indexes for performance
CREATE INDEX idx_receipts_user_date ON receipts(user_id, purchase_date);
CREATE INDEX idx_receipt_items_category ON receipt_items(category);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active, user_id);
```

#### Cache Layer (Redis)

```redis
# Real-time data caching
- price_data:store_id:product_id -> Current price
- user_session:user_id -> Session data
- api_cache:endpoint:params -> API responses
- ml_predictions:user_id -> Cached predictions
```

#### Analytics Database (ClickHouse)

```sql
-- Time-series data for analytics
Tables:
- price_history (historical price data)
- user_events (interaction tracking)
- ml_model_metrics (model performance)
- spending_analytics (aggregated data)

-- Optimized for analytical queries
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, timestamp)
```

## Machine Learning Pipeline

### 1. Price Prediction Model

#### LSTM Neural Network Architecture

```python
import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.models import Sequential

def create_price_prediction_model(sequence_length=30):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(sequence_length, 5)),
        Dropout(0.2),
        LSTM(50, return_sequences=True),
        Dropout(0.2),
        LSTM(50),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])

    model.compile(
        optimizer='adam',
        loss='mean_squared_error',
        metrics=['mae']
    )

    return model

# Features used:
# - Historical prices
# - Seasonal indicators
# - Day of week
# - Store promotions
# - Market conditions
```

#### Model Training Pipeline

```python
class PricePredictionPipeline:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()

    def prepare_data(self, price_data):
        # Feature engineering
        features = self.extract_features(price_data)

        # Create sequences for LSTM
        X, y = self.create_sequences(features, sequence_length=30)

        # Scale features
        X_scaled = self.scaler.fit_transform(X.reshape(-1, X.shape[-1]))
        X_scaled = X_scaled.reshape(X.shape)

        return X_scaled, y

    def train_model(self, training_data):
        X, y = self.prepare_data(training_data)

        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Train model
        self.model = create_price_prediction_model()
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=100,
            batch_size=32,
            callbacks=[
                EarlyStopping(patience=10),
                ModelCheckpoint('best_model.h5', save_best_only=True)
            ]
        )

        return history
```

### 2. Recommendation System

#### Collaborative Filtering + Content-Based Hybrid

```python
class HybridRecommendationSystem:
    def __init__(self):
        self.cf_model = CollaborativeFiltering()
        self.cb_model = ContentBasedFiltering()
        self.weights = {'cf': 0.6, 'cb': 0.3, 'price': 0.1}

    def get_recommendations(self, user_id, num_recommendations=10):
        # Collaborative filtering score
        cf_scores = self.cf_model.predict_user_preferences(user_id)

        # Content-based score
        cb_scores = self.cb_model.predict_user_preferences(user_id)

        # Price optimization score
        price_scores = self.calculate_price_scores(user_id)

        # Combine scores
        final_scores = (
            self.weights['cf'] * cf_scores +
            self.weights['cb'] * cb_scores +
            self.weights['price'] * price_scores
        )

        # Get top recommendations
        top_products = np.argsort(final_scores)[-num_recommendations:]

        return self.format_recommendations(top_products, final_scores)
```

### 3. Shopping List to Receipt Mapping

#### Similarity Algorithm with ML Enhancement

```python
class ShoppingListMapper:
    def __init__(self):
        self.similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.category_classifier = load_model('category_classifier.pkl')

    def map_items(self, shopping_list, receipt_items):
        mappings = []

        for shopping_item in shopping_list:
            best_match = None
            best_score = 0.0

            # Get embedding for shopping item
            shopping_embedding = self.similarity_model.encode(
                f"{shopping_item['name']} {shopping_item['category']}"
            )

            for receipt_item in receipt_items:
                # Calculate similarity score
                receipt_embedding = self.similarity_model.encode(
                    f"{receipt_item['product_name']} {receipt_item['category']}"
                )

                # Cosine similarity
                similarity = cosine_similarity(
                    shopping_embedding.reshape(1, -1),
                    receipt_embedding.reshape(1, -1)
                )[0][0]

                # Category bonus
                if shopping_item['category'] == receipt_item['category']:
                    similarity += 0.2

                if similarity > best_score and similarity > 0.6:
                    best_score = similarity
                    best_match = receipt_item

            mappings.append({
                'shopping_item': shopping_item,
                'receipt_item': best_match,
                'confidence': best_score,
                'status': self.determine_status(shopping_item, best_match)
            })

        return mappings
```

## Real-time Data Processing

### WebSocket Implementation

```python
# Backend WebSocket handler
from flask_socketio import SocketIO, emit, join_room, leave_room

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('subscribe_price_updates')
def handle_price_subscription(data):
    user_id = get_jwt_identity()
    product_ids = data.get('product_ids', [])

    # Join user to product-specific rooms
    for product_id in product_ids:
        join_room(f"price_updates_{product_id}")

    emit('subscription_confirmed', {'products': product_ids})

# Price update broadcaster
async def broadcast_price_updates():
    while True:
        # Fetch latest prices
        price_updates = await fetch_latest_prices()

        for update in price_updates:
            socketio.emit('price_update', {
                'product_id': update['product_id'],
                'new_price': update['price'],
                'store': update['store'],
                'timestamp': update['timestamp']
            }, room=f"price_updates_{update['product_id']}")

        await asyncio.sleep(30)  # Update every 30 seconds
```

### Async Price Fetching

```python
import aiohttp
import asyncio

class AsyncPriceFetcher:
    def __init__(self):
        self.stores = [
            {'name': 'Walmart', 'api_url': 'https://api.walmart.com/v3/items'},
            {'name': 'Chedraui', 'api_url': 'https://api.chedraui.com.mx/productos'},
            {'name': 'Soriana', 'api_url': 'https://api.soriana.com/productos'},
        ]

    async def fetch_all_prices(self, product_queries):
        async with aiohttp.ClientSession() as session:
            tasks = []

            for store in self.stores:
                for query in product_queries:
                    task = self.fetch_store_price(session, store, query)
                    tasks.append(task)

            results = await asyncio.gather(*tasks, return_exceptions=True)
            return self.process_results(results)

    async def fetch_store_price(self, session, store, query):
        try:
            async with session.get(
                store['api_url'],
                params={'query': query, 'limit': 1},
                timeout=aiohttp.ClientTimeout(total=5)
            ) as response:
                data = await response.json()
                return self.parse_price_data(data, store['name'])

        except asyncio.TimeoutError:
            return {'error': 'timeout', 'store': store['name']}
        except Exception as e:
            return {'error': str(e), 'store': store['name']}
```

## Security & Privacy Implementation

### Authentication & Authorization

```python
# JWT-based authentication with refresh tokens
class AuthenticationManager:
    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET_KEY')
        self.access_token_expiry = timedelta(hours=1)
        self.refresh_token_expiry = timedelta(days=30)

    def generate_tokens(self, user_id):
        access_token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.utcnow() + self.access_token_expiry,
            'type': 'access'
        }, self.secret_key, algorithm='HS256')

        refresh_token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.utcnow() + self.refresh_token_expiry,
            'type': 'refresh'
        }, self.secret_key, algorithm='HS256')

        return access_token, refresh_token

    def verify_token(self, token, token_type='access'):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            if payload['type'] != token_type:
                raise InvalidTokenError()
            return payload
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError()
        except jwt.InvalidTokenError:
            raise InvalidTokenError()
```

### Data Privacy & GDPR Compliance

```python
class PrivacyManager:
    def __init__(self):
        self.encryption_key = Fernet.generate_key()
        self.fernet = Fernet(self.encryption_key)

    def encrypt_pii(self, data):
        """Encrypt personally identifiable information"""
        if isinstance(data, str):
            return self.fernet.encrypt(data.encode()).decode()
        return data

    def anonymize_data(self, user_data):
        """Anonymize data for analytics while preserving utility"""
        anonymized = user_data.copy()

        # Remove direct identifiers
        anonymized.pop('email', None)
        anonymized.pop('phone', None)

        # Hash user ID
        anonymized['user_hash'] = hashlib.sha256(
            str(user_data['user_id']).encode()
        ).hexdigest()[:16]

        return anonymized

    def handle_gdpr_request(self, user_id, request_type):
        """Handle GDPR data requests"""
        if request_type == 'export':
            return self.export_user_data(user_id)
        elif request_type == 'delete':
            return self.delete_user_data(user_id)
        elif request_type == 'portability':
            return self.export_portable_data(user_id)
```

## Performance Optimization

### Database Optimization

```sql
-- Partitioning for large tables
CREATE TABLE price_history (
    id BIGSERIAL,
    product_id INT,
    store_id INT,
    price DECIMAL(10,2),
    recorded_at TIMESTAMP
) PARTITION BY RANGE (recorded_at);

-- Create monthly partitions
CREATE TABLE price_history_2024_01 PARTITION OF price_history
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_price_history_product_date
ON price_history (product_id, recorded_at DESC);

CREATE INDEX CONCURRENTLY idx_receipts_user_purchase_date
ON receipts (user_id, purchase_date DESC);
```

### Caching Strategy

```python
class CacheManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST'),
            port=6379,
            decode_responses=True
        )
        self.default_ttl = 3600  # 1 hour

    def cache_price_data(self, product_id, store_id, price_data):
        key = f"price:{product_id}:{store_id}"
        self.redis_client.setex(
            key,
            self.default_ttl,
            json.dumps(price_data)
        )

    def get_cached_price(self, product_id, store_id):
        key = f"price:{product_id}:{store_id}"
        cached_data = self.redis_client.get(key)

        if cached_data:
            return json.loads(cached_data)
        return None

    def invalidate_price_cache(self, product_id):
        pattern = f"price:{product_id}:*"
        keys = self.redis_client.keys(pattern)
        if keys:
            self.redis_client.delete(*keys)
```

## Monitoring & Observability

### Application Monitoring

```python
# Using Prometheus metrics
from prometheus_client import Counter, Histogram, Gauge

# Metrics collection
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_USERS = Gauge('active_users_total', 'Number of active users')
ML_PREDICTION_ACCURACY = Gauge('ml_prediction_accuracy', 'ML model accuracy')

# Custom metrics middleware
@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.endpoint
    ).inc()

    REQUEST_DURATION.observe(time.time() - request.start_time)

    return response
```

### Health Checks

```python
@app.route('/health')
def health_check():
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': os.getenv('APP_VERSION', '1.0.0'),
        'checks': {}
    }

    # Database connectivity
    try:
        db.session.execute('SELECT 1')
        health_status['checks']['database'] = 'healthy'
    except Exception as e:
        health_status['checks']['database'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # Redis connectivity
    try:
        redis_client.ping()
        health_status['checks']['redis'] = 'healthy'
    except Exception as e:
        health_status['checks']['redis'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # External API availability
    health_status['checks']['external_apis'] = check_external_apis()

    status_code = 200 if health_status['status'] == 'healthy' else 503
    return jsonify(health_status), status_code
```

## Deployment & DevOps

### Docker Configuration

```dockerfile
# Multi-stage build for Python backend
FROM python:3.11-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Production stage
FROM base as production

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bitebudget-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bitebudget-backend
  template:
    metadata:
      labels:
        app: bitebudget-backend
    spec:
      containers:
        - name: backend
          image: bitebudget/backend:latest
          ports:
            - containerPort: 5000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: url
            - name: REDIS_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: redis-url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 5000
            initialDelaySeconds: 5
            periodSeconds: 5
```

## Summary

This technical architecture provides:

1. **Scalability**: Microservices can scale independently
2. **Reliability**: Health checks, monitoring, and fault tolerance
3. **Performance**: Caching, async processing, and database optimization
4. **Security**: Authentication, encryption, and GDPR compliance
5. **Maintainability**: Clean code, documentation, and monitoring
6. **Academic Compliance**: Meets all distributed systems requirements

The system is designed for production deployment on cloud platforms while meeting all academic requirements for a robust, distributed, and intelligent application.
