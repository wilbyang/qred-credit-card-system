import { useState, useEffect } from 'react';
import { trpc } from './utils/trpc';

export default function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [transactionLimit, setTransactionLimit] = useState(3);

  const companiesQuery = trpc.company.getAll.useQuery();
  const cardsQuery = trpc.card.getByCompany.useQuery(
    { companyId: selectedCompanyId },
    { enabled: !!selectedCompanyId }
  );
  const cardQuery = trpc.card.getById.useQuery(
    { id: selectedCardId },
    { enabled: !!selectedCardId }
  );
  const invoiceQuery = trpc.card.getInvoice.useQuery(
    { id: selectedCardId },
    { enabled: !!selectedCardId }
  );
  const transactionsQuery = trpc.transaction.getByCard.useQuery(
    { cardId: selectedCardId, limit: transactionLimit, offset: 0 },
    { enabled: !!selectedCardId }
  );

  const activateCardMutation = trpc.card.activate.useMutation({
    onSuccess: () => {
      cardQuery.refetch();
    },
  });

  // Auto-select first company and its first card
  useEffect(() => {
    if (companiesQuery.data && companiesQuery.data.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companiesQuery.data[0].id);
    }
  }, [companiesQuery.data, selectedCompanyId]);

  useEffect(() => {
    if (cardsQuery.data && cardsQuery.data.length > 0 && !selectedCardId) {
      setSelectedCardId(cardsQuery.data[0].id);
    }
  }, [cardsQuery.data, selectedCardId]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
    setSelectedCardId(''); // Reset card selection
  };

  const handleActivateCard = () => {
    if (selectedCardId) {
      activateCardMutation.mutate({ id: selectedCardId });
    }
  };

  const handleLoadMore = () => {
    if (transactions) {
      setTransactionLimit(transactions.total);
    }
  };

  const handleInvoiceClick = () => {
    if (invoice) {
      // Navigate to invoice details or show invoice modal
      console.log('Invoice clicked:', invoice);
      alert(`Invoice Due: ${invoice.amount} ${invoice.currency}\nDue Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    }
  };

  const handleCardImageClick = () => {
    // Navigate to card details or show card information
    console.log('Card image clicked');
    alert('Card details - Feature coming soon');
  };

  if (companiesQuery.isLoading) {
    return (
      <div className="app-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (companiesQuery.error) {
    return (
      <div className="app-container">
        <div className="error">Error loading companies</div>
      </div>
    );
  }

  const card = cardQuery.data;
  const invoice = invoiceQuery.data;
  const transactions = transactionsQuery.data;

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo">Logo</div>
        <button className="menu-btn">Menu</button>
      </div>

      {/* Company Selector */}
      <div className="company-selector">
        <select 
          className="company-select" 
          value={selectedCompanyId}
          onChange={handleCompanyChange}
        >
          {companiesQuery.data?.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {card && (
        <>
          {/* Card Section */}
          <div className="card-container">
            {/* Invoice Badge */}
            {invoice && (
              <div className="invoice-badge" onClick={handleInvoiceClick} style={{ cursor: 'pointer' }}>
                Invoice due 
              </div>
            )}

            {/* Card Image */}
            <div className="card-image-section" onClick={handleCardImageClick} style={{ cursor: 'pointer' }}>
              Card image
              <span className="arrow-icon">›</span>
            </div>
          </div>

          {/* Remaining Spend */}
          <div className="remaining-spend-section">
            <div className="remaining-spend-label">Remaining spend</div>
            <div className="remaining-spend-value">
              {card.currentSpend.toLocaleString()} / {card.limit.toLocaleString()} {card.currency}
              <span className="arrow-icon">›</span>
            </div>
            <div className="remaining-spend-note">based on your set limit</div>
          </div>

          {/* Latest Transactions */}
          <div className="transactions-section">
            <div className="transactions-title">Latest transactions</div>
            {transactions?.transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <span className="transaction-description">{transaction.description}</span>
                <span className="transaction-data">{transaction.dataPoints}</span>
              </div>
            ))}
            
            {transactions && transactions.total > transactionLimit && (
              <button className="view-more-btn" onClick={handleLoadMore}>
                {transactions.total - transactionLimit} more items in transaction view
                <span className="arrow-icon">›</span>
              </button>
            )}
          </div>

          {/* Activate Card Button */}
          {card.status === 'inactive' && (
            <button 
              className="activate-btn"
              onClick={handleActivateCard}
              disabled={activateCardMutation.isLoading}
            >
              {activateCardMutation.isLoading ? 'Activating...' : 'Activate card'}
            </button>
          )}
          
          {card.status === 'active' && (
            <button className="activate-btn" disabled>
              Card is Active
            </button>
          )}

          {/* Support Button */}
          <button className="support-btn">Contact Qred's support</button>
        </>
      )}
    </div>
  );
}
