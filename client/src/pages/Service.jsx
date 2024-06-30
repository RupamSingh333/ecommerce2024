import React from 'react';

const ServicePage = () => {
  return (
    <div className="service-page">
      <div className="service-header">
        <h1>Our Services</h1>
        <p>We provide a range of services to meet your needs and exceed your expectations.</p>
      </div>

      <div className="service-cards">
        {renderServiceCard("Web Development", "Our team of experienced developers can create modern and responsive websites tailored to your business needs.")}
        {renderServiceCard("Mobile App Development", "Build powerful and user-friendly mobile applications for iOS and Android platforms to reach a wider audience.")}
        {renderServiceCard("UI/UX Design", "Create visually stunning and intuitive user interfaces that enhance the user experience of your products.")}
        
        {/* Additional service cards */}
        {renderServiceCard("SEO Optimization", "Improve your website's visibility in search engines and attract more organic traffic.")}
        {renderServiceCard("Graphic Design", "Craft visually appealing graphics and illustrations to enhance your brand presence.")}
        {renderServiceCard("Digital Marketing", "Develop strategic digital marketing campaigns to reach and engage your target audience.")}
      </div>
    </div>
  );
};

// Helper function to render a service card
const renderServiceCard = (title, description) => (
  <div className="service-card" key={title}>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default ServicePage;
