import axios from "axios";
import { useState } from "react";

function App() {

  const [rules, setRules] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [user, setUser] = useState("Salesforce User");
  const [activeTab, setActiveTab] = useState("validation");

  if (
    window.location.search.includes("login=success")
  ) {

    localStorage.setItem("loggedIn", "true");

  }

  const loginToSalesforce = () => {

    window.location.href = "http://localhost:5000/login";

  };

  const getValidationRules = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/validation-rules"
      );

      const updatedRules = response.data.map((rule) => ({
        ...rule,
        Active: false,
      }));

      setRules(updatedRules);

    } catch (error) {

      console.log(error);
      alert("Error fetching validation rules");

    }
  };

  const toggleRule = (id) => {

    const updatedRules = rules.map((rule) => {

      if (rule.Id === id) {

        return {
          ...rule,
          Active: !rule.Active,
        };

      }

      return rule;

    });

    setRules(updatedRules);

    alert("All Changes Saved !");
  };

  // LOGIN PAGE

  if (!loggedIn) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f6f9",
          fontFamily: "Arial",
          padding: "30px",
          textAlign: "center",
        }}
      >

        <h1 style={{ fontSize: "50px" }}>
          Salesforce Switch 
        </h1>

        <p
          style={{
            width: "60%",
            color: "gray",
            lineHeight: "28px",
            fontSize: "18px",
          }}
        >
          A Salesforce management dashboard built using
          React, Node.js, OAuth2 and Tooling API.
          This application helps administrators manage
          Validation Rules, Workflows, Process Flows,
          and Apex Triggers directly from a web interface.
        </p>

        <button
          onClick={loginToSalesforce}
          style={{
            marginTop: "30px",
            padding: "15px 40px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Login to Salesforce
        </button>

      </div>

    );
  }

  // DASHBOARD PAGE

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        fontFamily: "Arial",
      }}
    >

      {/* TOP BAR */}

      <div
        style={{
          background: "#1e293b",
          color: "white",
          padding: "20px 40px",
        }}
      >

        <h2>SF Switch Dashboard ⚡</h2>

        <p>
          Logged in as: {user}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("loggedIn");
            window.location.reload();
          }}
          style={{
            padding: "8px 15px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Logout
        </button>

      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px 40px",
          background: "white",
          borderBottom: "1px solid #ddd",
        }}
      >

        <button onClick={() => setActiveTab("validation")}>
          Validation Rules
        </button>

        <button onClick={() => setActiveTab("workflow")}>
          Workflows
        </button>

        <button onClick={() => setActiveTab("process")}>
          Process Flows
        </button>

        <button onClick={() => setActiveTab("triggers")}>
          Triggers
        </button>

      </div>

      {/* CONTENT */}

      <div style={{ padding: "40px" }}>

        {/* VALIDATION */}

        {activeTab === "validation" && (

          <div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >

              <div>

                <h2>Accounts</h2>

                <p style={{ color: "gray" }}>
                  Manage Account Validation Rules
                </p>

              </div>

              <button
                onClick={getValidationRules}
                style={{
                  padding: "10px 25px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  height: "50px",
                }}
              >
                Enable / Disable
              </button>

            </div>

            {/* RULES */}

            {rules.map((rule) => (

              <div
                key={rule.Id}
                style={{
                  background: "white",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >

                <h3>{rule.ValidationName}</h3>

                <button
                  onClick={() => toggleRule(rule.Id)}
                  style={{
                    padding: "10px 25px",
                    background: rule.Active
                      ? "#dc2626"
                      : "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  {rule.Active ? "ON" : "OFF"}
                </button>

              </div>

            ))}

          </div>

        )}

        {activeTab === "workflow" && (
          <h2>⚙ Workflow Rules Module</h2>
        )}

        {activeTab === "process" && (
          <h2>🔄 Process Flow Module</h2>
        )}

        {activeTab === "triggers" && (
          <h2>⚡ Apex Trigger Module</h2>
        )}

      </div>

    </div>

  );
}

export default App;