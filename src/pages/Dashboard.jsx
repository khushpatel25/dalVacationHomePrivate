const Dashboard = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center font-semibold text-4xl my-3">Dashboard</div>
      <div className="w-full">
        <iframe
          title="Looker Studio Report 1"
          width="100%"
          height="600"
          src="https://lookerstudio.google.com/embed/reporting/86b613ee-217d-442e-a92a-2f09c61ac766/page/IHF6D"
          allowFullScreen
        ></iframe>
      </div>
      <div className="w-full mt-8">
        <iframe
          title="Looker Studio Report 2"
          width="100%"
          height="600"
          src="https://lookerstudio.google.com/embed/reporting/86b613ee-217d-442e-a92a-2f09c61ac766/page/p_j3a0t9xbjd"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Dashboard;
