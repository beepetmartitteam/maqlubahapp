import React from 'react'
import './CustomerList.css'

const CustomerList = () => {
  const customerGroups = [
    {
      title: "Tn SHukri Md Nor",
      customers: [
        { id: 1, name: "Darwis Nurhadi", location: "Medan" },
        { id: 2, name: "Khairi Tamrin", location: "Aceh" },
        { id: 3, name: "Fida Amal", location: "Medan" },
        { id: 4, name: "Syarifuddin", location: "Pekan Baru" }
      ]
    },
    {
      title: "TN SYarif Hidayatullah",
      customers: [
        { id: 5, name: "Umair Tan", location: "Palembang" },
        { id: 6, name: "Fadli Fathoni", location: "Body copy description" }
      ]
    }
  ]

  return (
    <div className="daftar-customer">
      <div className="scroll-group">
        {customerGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="section-header">
              <div className="section-header2">{group.title}</div>
              <div className="action-group">
                <div className="button">
                  <div className="base-button">
                    <div className="button-text">View all</div>
                  </div>
                </div>
              </div>
            </div>
            {group.customers.map((customer) => (
              <div key={customer.id} className="content-row">
                <div className="content">
                  <div className="avatar-placeholder">
                    <img 
                      src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23f2f2f2'/%3E%3Ctext x='32' y='32' text-anchor='middle' dy='.3em' font-family='Arial' font-size='20' fill='%23666'%3E${customer.name.charAt(0)}%3C/text%3E%3C/svg%3E`} 
                      alt={customer.name}
                      className="avatar-img"
                    />
                  </div>
                  <div className="copy">
                    <div className="row-headline">{customer.name}</div>
                    <div className="row-description">{customer.location}</div>
                  </div>
                </div>
                <div className="arrow-right">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="navigation-bar">
        <div className="large-title-bar">
          <div className="large-title-grp">
            <div className="page-title">Customer</div>
            <div className="page-subtitle">Customer Syarikat</div>
          </div>
          <div className="right-actions">
            <div className="icon-button">
              <svg className="search" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="icon-button">
              <svg className="icon-bg-light" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#666"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="_9-41">9:41</div>
      </div>

      <div className="footer">
        <div className="icon-button">
          <svg className="home" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="icon-button">
          <svg className="heart-outline" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95904 2.12831 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77753 22.3095 7.06212 22.0329 6.39464C21.7563 5.72715 21.351 5.12075 20.84 4.61Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="icon-button">
          <svg className="shopping-cart" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="21" r="1" fill="#666"/>
            <circle cx="20" cy="21" r="1" fill="#666"/>
            <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="icon-button">
          <svg className="search2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="icon-button">
          <svg className="user" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" fill="#666"/>
          </svg>
        </div>
      </div>

      <div className="home-indicator">
        <div className="rectangle"></div>
      </div>
    </div>
  )
}

export default CustomerList