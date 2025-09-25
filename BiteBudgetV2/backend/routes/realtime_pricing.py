from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import json
from datetime import datetime, timedelta
import asyncio
import aiohttp
from typing import Dict, List

realtime_pricing_bp = Blueprint('realtime_pricing', __name__)

# Mock external API endpoints - in production these would be real APIs
WALMART_API_BASE = "https://api.walmart.com/v3/items"
AMAZON_API_BASE = "https://api.amazon.com/products"
CHEDRAUI_API_BASE = "https://api.chedraui.com.mx/productos"

# Price tracking configuration
PRICE_TRACKING_STORES = [
    {"id": "walmart", "name": "Walmart", "api_endpoint": WALMART_API_BASE},
    {"id": "chedraui", "name": "Chedraui", "api_endpoint": CHEDRAUI_API_BASE},
    {"id": "soriana", "name": "Soriana", "api_endpoint": "https://api.soriana.com/productos"},
    {"id": "costco", "name": "Costco", "api_endpoint": "https://api.costco.com.mx/items"},
]

class RealTimePriceTracker:
    def __init__(self):
        self.price_history = {}
        self.active_alerts = {}
        
    async def fetch_prices_async(self, product_queries: List[str]) -> Dict:
        """Fetch prices from multiple stores asynchronously"""
        async with aiohttp.ClientSession() as session:
            tasks = []
            for store in PRICE_TRACKING_STORES:
                for query in product_queries:
                    task = self.fetch_store_price(session, store, query)
                    tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            return self.process_price_results(results)
    
    async def fetch_store_price(self, session, store: Dict, product_query: str):
        """Fetch price from a specific store"""
        try:
            # Mock API call - in production this would be actual HTTP requests
            # For demonstration, return mock data
            mock_price_data = self.get_mock_price_data(store["id"], product_query)
            return mock_price_data
        except Exception as e:
            return {"error": str(e), "store": store["id"], "product": product_query}
    
    def get_mock_price_data(self, store_id: str, product_query: str) -> Dict:
        """Generate mock price data for demonstration"""
        import random
        
        base_prices = {
            "milk": 25.00,
            "bread": 30.00,
            "eggs": 45.00,
            "chicken": 120.00,
            "rice": 35.00,
            "coca-cola": 22.50,
            "bananas": 18.00,
        }
        
        # Simulate price variations by store
        store_multipliers = {
            "walmart": 0.95,
            "chedraui": 1.02,
            "soriana": 1.05,
            "costco": 0.88,
        }
        
        product_key = product_query.lower()
        base_price = base_prices.get(product_key, 50.00)
        store_multiplier = store_multipliers.get(store_id, 1.0)
        
        # Add random variation
        variation = random.uniform(0.9, 1.1)
        final_price = base_price * store_multiplier * variation
        
        return {
            "store_id": store_id,
            "store_name": store_id.capitalize(),
            "product_name": product_query,
            "price": round(final_price, 2),
            "currency": "MXN",
            "availability": "in_stock",
            "last_updated": datetime.now().isoformat(),
            "confidence": random.uniform(85, 99),
        }

    def process_price_results(self, results: List) -> Dict:
        """Process and organize price comparison results"""
        processed = {
            "timestamp": datetime.now().isoformat(),
            "products": {},
            "best_deals": [],
            "price_alerts": []
        }
        
        for result in results:
            if isinstance(result, dict) and "error" not in result:
                product = result["product_name"]
                if product not in processed["products"]:
                    processed["products"][product] = []
                
                processed["products"][product].append(result)
        
        # Find best deals for each product
        for product, prices in processed["products"].items():
            if prices:
                best_price = min(prices, key=lambda x: x["price"])
                processed["best_deals"].append({
                    "product": product,
                    "best_price": best_price["price"],
                    "store": best_price["store_name"],
                    "savings_vs_avg": self.calculate_savings(prices, best_price["price"])
                })
        
        return processed
    
    def calculate_savings(self, prices: List[Dict], best_price: float) -> float:
        """Calculate savings compared to average price"""
        if len(prices) < 2:
            return 0.0
        
        avg_price = sum(p["price"] for p in prices) / len(prices)
        return round(avg_price - best_price, 2)

# Initialize price tracker
price_tracker = RealTimePriceTracker()

@realtime_pricing_bp.route('/compare-prices', methods=['POST'])
@jwt_required()
def compare_prices():
    """Compare prices across multiple stores for given products"""
    try:
        data = request.get_json()
        products = data.get('products', [])
        
        if not products:
            return jsonify({'error': 'No products specified'}), 400
        
        # For async operations in Flask, we need to handle differently
        # In production, you might use Celery or similar for background tasks
        
        # Mock implementation for demonstration
        results = {
            "timestamp": datetime.now().isoformat(),
            "products": {},
            "best_deals": [],
            "total_savings": 0
        }
        
        for product in products:
            # Simulate fetching from multiple stores
            store_prices = []
            for store in PRICE_TRACKING_STORES:
                price_data = price_tracker.get_mock_price_data(store["id"], product)
                store_prices.append(price_data)
            
            results["products"][product] = store_prices
            
            # Find best deal
            if store_prices:
                best_price = min(store_prices, key=lambda x: x["price"])
                savings = price_tracker.calculate_savings(store_prices, best_price["price"])
                
                results["best_deals"].append({
                    "product": product,
                    "best_price": best_price["price"],
                    "store": best_price["store_name"],
                    "savings": savings
                })
                
                results["total_savings"] += savings
        
        return jsonify({
            'message': 'Price comparison completed',
            'data': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@realtime_pricing_bp.route('/price-alerts', methods=['GET'])
@jwt_required()
def get_price_alerts():
    """Get active price alerts for user"""
    try:
        user_id = get_jwt_identity()
        
        # Mock active alerts
        alerts = [
            {
                "id": 1,
                "product_name": "Coca-Cola 2L",
                "target_price": 20.00,
                "current_price": 18.50,
                "store_name": "Walmart",
                "percentage_drop": 7.5,
                "alert_type": "price_drop",
                "created_at": datetime.now().isoformat(),
                "is_active": True
            },
            {
                "id": 2,
                "product_name": "Pan Bimbo Integral",
                "target_price": 25.00,
                "current_price": 23.90,
                "store_name": "Chedraui",
                "percentage_drop": 4.4,
                "alert_type": "price_drop",
                "created_at": datetime.now().isoformat(),
                "is_active": True
            }
        ]
        
        return jsonify({
            'message': 'Price alerts retrieved successfully',
            'data': alerts
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@realtime_pricing_bp.route('/price-alerts', methods=['POST'])
@jwt_required()
def create_price_alert():
    """Create a new price alert"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['product_name', 'target_price', 'stores']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        alert = {
            "id": len(price_tracker.active_alerts) + 1,
            "user_id": user_id,
            "product_name": data['product_name'],
            "target_price": float(data['target_price']),
            "stores": data['stores'],
            "alert_type": data.get('alert_type', 'price_drop'),
            "is_active": True,
            "created_at": datetime.now().isoformat()
        }
        
        price_tracker.active_alerts[alert["id"]] = alert
        
        return jsonify({
            'message': 'Price alert created successfully',
            'data': alert
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@realtime_pricing_bp.route('/price-trends/<product_name>', methods=['GET'])
@jwt_required()
def get_price_trends(product_name):
    """Get price trend data for a specific product"""
    try:
        # Mock trend data
        import random
        from datetime import datetime, timedelta
        
        # Generate mock price history for last 30 days
        base_price = 25.00
        price_history = []
        
        for i in range(30):
            date = datetime.now() - timedelta(days=29-i)
            # Simulate price fluctuation
            variation = random.uniform(0.9, 1.15)
            price = round(base_price * variation, 2)
            
            price_history.append({
                "date": date.isoformat(),
                "price": price,
                "store": random.choice(["Walmart", "Chedraui", "Soriana"])
            })
        
        # ML-based prediction (mock)
        trend_direction = "stable"
        confidence = random.uniform(75, 95)
        next_week_prediction = base_price * random.uniform(0.95, 1.05)
        
        if next_week_prediction > base_price * 1.02:
            trend_direction = "up"
        elif next_week_prediction < base_price * 0.98:
            trend_direction = "down"
        
        result = {
            "product_name": product_name,
            "price_history": price_history,
            "current_price": price_history[-1]["price"],
            "prediction": {
                "next_week": round(next_week_prediction, 2),
                "confidence": round(confidence, 1),
                "trend": trend_direction
            },
            "statistics": {
                "min_price": min(p["price"] for p in price_history),
                "max_price": max(p["price"] for p in price_history),
                "avg_price": round(sum(p["price"] for p in price_history) / len(price_history), 2),
                "volatility": round(random.uniform(0.1, 0.3), 2)
            }
        }
        
        return jsonify({
            'message': 'Price trends retrieved successfully',
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@realtime_pricing_bp.route('/ml-predictions', methods=['GET'])
@jwt_required()
def get_ml_predictions():
    """Get ML-powered price predictions for user's frequent products"""
    try:
        user_id = get_jwt_identity()
        
        # Mock ML predictions
        predictions = [
            {
                "product_name": "Leche Lala 1L",
                "current_price": 23.50,
                "predicted_price_next_week": 23.20,
                "confidence": 92,
                "trend": "stable",
                "recommendation": "buy_now",
                "savings_potential": 8.50,
                "factors": ["seasonal_discount", "supply_increase"]
            },
            {
                "product_name": "Huevos San Juan 18 pz",
                "current_price": 46.50,
                "predicted_price_next_week": 48.20,
                "confidence": 85,
                "trend": "bullish",
                "recommendation": "buy_bulk",
                "savings_potential": 15.60,
                "factors": ["seasonal_demand", "supply_shortage"]
            },
            {
                "product_name": "Arroz Verde Valle 1kg",
                "current_price": 32.90,
                "predicted_price_next_week": 32.50,
                "confidence": 88,
                "trend": "bearish",
                "recommendation": "wait",
                "savings_potential": 4.80,
                "factors": ["new_harvest", "increased_competition"]
            }
        ]
        
        return jsonify({
            'message': 'ML predictions retrieved successfully',
            'data': {
                "predictions": predictions,
                "model_info": {
                    "algorithm": "LSTM + Random Forest Ensemble",
                    "training_data_size": 50000,
                    "last_updated": datetime.now().isoformat(),
                    "overall_accuracy": 87.3
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
