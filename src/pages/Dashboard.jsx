import React from 'react';

const Dashboard = () => {
  return (
    <div classname="flex justify-center items-center h-16">
      <div className="text-center font-semibold text-4xl">Dashboard</div>
      <iframe
        title="Looker Studio Report"
        width="100%"
        height="600"
        src="https://lookerstudio.google.com/embed/reporting/86b613ee-217d-442e-a92a-2f09c61ac766/page/IHF6D"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Dashboard;
