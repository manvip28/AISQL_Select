import React, { useState } from "react";
import "./QueryForm.css";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [inputType, setInputType] = useState("attach");
  const [jsonText, setJsonText] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => setJsonText(event.target.result);
      reader.readAsText(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let parsedSchema;
    try {
      parsedSchema = inputType === "paste" ? JSON.parse(jsonText) : jsonText;
    } catch (err) {
      setError("Invalid JSON format.");
      setLoading(false);
      return;
    }

    const payload = {
      query,
      tables: parsedSchema,
    };

    try {
      const res = await fetch("http://localhost:5000/generate_sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div class="title">AI SQL Generator</div>
    <div className="query-container">
      <div className="input-section">
        <form onSubmit={handleSubmit} className="query-form">
          <div className="form-group">
            <label className="form-label">Enter your query:</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Show me all orders from last month"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Choose Input Type:</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="dropdown"
            >
              <option value="attach">Attach a File</option>
              <option value="paste">Paste JSON</option>
            </select>
          </div>

          {inputType === "attach" ? (
            <div className="form-group">
              <label className="form-label">Upload JSON File:</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="file-input"
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Paste JSON Schema:</label>
              <textarea
                rows="6"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='{"tables": [{"name": "orders", "columns": ["id", "date"]}]}'
                className="textarea"
              ></textarea>
            </div>
          )}

          <button type="submit" className="process-btn" disabled={loading}>
            {loading ? "Processing..." : "Generate Query"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
      
      <div className="output-section">
  {response ? (
    <>
      {/* SQL Query Section */}
      <div className="sql-section">
        <h3>Generated SQL Query:</h3>
        <pre className="sql-query">{response.sql_query}</pre>
      </div>

      {/* Filtered Schema Table */}
      <div className="schema-section">
        <h3>Filtered Schema:</h3>
        {response.filtered_schema && response.filtered_schema.tables ? (
          <table className="schema-table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Columns</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(response.filtered_schema.tables).map(
                ([tableName, tableData]) => (
                  <tr key={tableName}>
                    <td>{tableName}</td>
                    <td>{tableData.columns.join(", ")}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <p>No filtered schema found.</p>
        )}
      </div>
    </>
  ) : (
    <div className="placeholder">
      <h3>Generated SQL Query:</h3>
      <p>No query generated yet.</p>

      <h3>Filtered Schema:</h3>
      <p>No schema processed yet.</p>
    </div>
  )}
</div>


    </div>
    </div>
  );
};

export default QueryForm;
