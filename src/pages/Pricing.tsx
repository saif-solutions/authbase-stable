import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';

const Pricing: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const pricingTiers = [
    {
      name: 'Basic',
      price: '$89',
      description: 'Perfect for small projects',
      features: [
        'Up to 1,000 users',
        'Basic authentication',
        'Email support',
        '1-year updates'
      ],
      tier: 'basic' as const
    },
    {
      name: 'Pro',
      price: '$299',
      description: 'For growing businesses',
      features: [
        'Up to 10,000 users',
        'Advanced security',
        'Priority support',
        'Custom branding',
        '2-year updates'
      ],
      tier: 'pro' as const,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$599',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Enterprise security',
        '24/7 phone support',
        'White-label solution',
        'Lifetime updates',
        'Custom development'
      ],
      tier: 'enterprise' as const
    }
  ];

  const handlePurchase = async (tier: 'basic' | 'pro' | 'enterprise') => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(tier);
    try {
      await paymentService.createCheckoutSession(tier, email);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error starting checkout process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pricing Plans
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect plan for your authentication needs
          </p>
        </div>

        {/* Email Input */}
        <div className="mt-8 max-w-md mx-auto">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 ${
                tier.popular ? 'border-blue-500 ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {tier.name}
                </h2>
                {tier.popular && (
                  <p className="mt-2 text-sm text-blue-600">Most Popular</p>
                )}
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">/one-time</span>
                </p>
                <button
                  onClick={() => handlePurchase(tier.tier)}
                  disabled={loading === tier.tier || !email}
                  className={`mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900 ${
                    loading === tier.tier ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading === tier.tier ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
