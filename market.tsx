import React, { useState } from 'react';

const MarketPage = () => {
  const [timeFrame, setTimeFrame] = useState('7D');
  const [sortOrder, setSortOrder] = useState('Top');
  const [showTimeFrameDropdown, setShowTimeFrameDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const timeFrameOptions = ['1H', '24H', '7D', '1M', '1Y', 'All'];
  const sortOptions = ['Top', 'Bottom'];
  
  const cryptoData = [
    { rank: 1, name: 'Bitcoin', ticker: 'BTC', image: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400' },
    { rank: 2, name: 'Ethereum', ticker: 'ETH', image: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628' },
    { rank: 3, name: 'Tether', ticker: 'USDT', image: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661' },
    { rank: 4, name: 'XRP', ticker: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png?1696501442' },
    { rank: 5, name: 'BNB', ticker: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970' },
    { rank: 6, name: 'Solana', ticker: 'SOL', image: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756' },
    { rank: 7, name: 'USDC', ticker: 'USDC', image: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694' },
    { rank: 8, name: 'Tron', ticker: 'TRX', image: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png?1696502193' },
    { rank: 9, name: 'Dogecoin', ticker: 'DOGE', image: 'https://assets.coingecko.com/coins/images/5/standard/dogecoin.png?1696501409' },
    { rank: 10, name: 'Cardano', ticker: 'ADA', image: 'https://assets.coingecko.com/coins/images/975/standard/cardano.png?1696502090' },
  ];

  return (
    <div style={{
      width: '393px',
      height: '852px',
      backgroundColor: '#121212',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2B2B2B',
        paddingTop: '20px',
        paddingBottom: '15px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#00B300',
          margin: '0 0 15px 0',
          textAlign: 'center'
        }}>Market</h1>
        
        {/* Dropdown Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between'
        }}>
          {/* USD Button */}
          <button style={{
            backgroundColor: '#3A3A3A',
            padding: '8px 15px',
            borderRadius: '8px',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            flex: 1
          }}>
            USD
          </button>
          
          {/* Time Frame Dropdown */}
          <div style={{ flex: 1, position: 'relative' }}>
            <button 
              onClick={() => setShowTimeFrameDropdown(!showTimeFrameDropdown)}
              style={{
                backgroundColor: '#3A3A3A',
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <span>% {timeFrame}</span>
              <span style={{ fontSize: '10px' }}>▼</span>
            </button>
            {showTimeFrameDropdown && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                backgroundColor: '#3A3A3A',
                borderRadius: '8px',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                {timeFrameOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setTimeFrame(option);
                      setShowTimeFrameDropdown(false);
                    }}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #4A4A4A',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    % {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div style={{ flex: 1, position: 'relative' }}>
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                backgroundColor: '#3A3A3A',
                padding: '8px 15px',
                borderRadius: '8px',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <span>{sortOrder}</span>
              <span style={{ fontSize: '10px' }}>▼</span>
            </button>
            {showSortDropdown && (
              <div style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                backgroundColor: '#3A3A3A',
                borderRadius: '8px',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSortOrder(option);
                      setShowSortDropdown(false);
                    }}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #4A4A4A',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crypto List */}
      <div style={{
        flex: 1,
        overflowY: 'auto'
      }}>
        {cryptoData.map((crypto, index) => (
          <div key={crypto.rank}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              gap: '10px'
            }}>
              {/* Rank */}
              <div style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                width: '30px'
              }}>
                {crypto.rank}
              </div>
              
              {/* Coin Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                gap: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={crypto.image} 
                    alt={crypto.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {crypto.name}
                  </div>
                  <div style={{
                    color: '#888888',
                    fontSize: '13px',
                    marginTop: '2px'
                  }}>
                    {crypto.ticker}
                  </div>
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div style={{
                width: '60px',
                height: '30px'
              }} />
              
              {/* Price Info */}
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  $0.00
                </div>
                <div style={{
                  color: '#888888',
                  fontSize: '13px',
                  marginTop: '2px'
                }}>
                  0%
                </div>
              </div>
            </div>
            {index < cryptoData.length - 1 && (
              <div style={{
                height: '1px',
                backgroundColor: '#2B2B2B',
                marginLeft: '15px',
                marginRight: '15px'
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;