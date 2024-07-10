// frontend/src/containers/Portfolio.js
import React, { useState, useEffect } from 'eact';
import { connect } from 'eact-redux';
import { fetchPortfolioData } from '../actions';
import PortfolioComponent from '../components/Portfolio';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import TransactionList from '../components/Transactions/TransactionList';
import Button from '../components/Button';

const Portfolio = ({ fetchPortfolioData, portfolioData }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const handleBuy = () => {
    // Handle buy button click
    console.log('Buy button clicked!');
  };

  const handleSell = () => {
    // Handle sell button click
    console.log('Sell button clicked!');
  };

  return (
    <PortfolioComponent>
      <div className="portfolio-header">
        <h2>Portfolio</h2>
      </div>
      <div className="portfolio-charts">
        <LineChart data={portfolioData.line} title="Portfolio Value" />
        <PieChart data={portfolioData.pie} title="Asset Allocation" />
      </div>
      <div className="portfolio-assets">
        <ul>
          {portfolioData.assets.map((asset, index) => (
            <li key={index}>
              <span>{asset.name}</span>
              <Button onClick={() => handleAssetSelect(asset)}>Select</Button>
            </li>
          ))}
        </ul>
      </div>
      {selectedAsset && (
        <div className="portfolio-asset-details">
          <h3>{selectedAsset.name}</h3>
          <p>Value: {selectedAsset.value}</p>
          <Button onClick={handleBuy}>Buy</Button>
          <Button onClick={handleSell}>Sell</Button>
        </div>
      )}
      <div className="portfolio-transactions">
        <TransactionList transactions={portfolioData.transactions} />
      </div>
    </PortfolioComponent>
  );
};

const mapStateToProps = state => {
  return {
    portfolioData: state.portfolio.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPortfolioData: () => dispatch(fetchPortfolioData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);