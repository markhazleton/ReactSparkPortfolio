import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3001/api/projects';

export default function AdminApp() {
  const [projects, setProjects] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [form, setForm] = useState({ id: '', image: '', p: '', d: '', h: '' });
  const [editId, setEditId] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlValidation, setUrlValidation] = useState({ isValid: null, message: '' });

  useEffect(() => {
    fetch(API).then(res => res.json()).then(setProjects);
    fetch('http://localhost:3001/api/images').then(res => res.json()).then(setAvailableImages);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateUrl = async (url) => {
    if (!url) {
      setUrlValidation({ isValid: false, message: 'URL is required' });
      return false;
    }

    // Check if URL has proper format
    try {
      new URL(url);
    } catch {
      setUrlValidation({ isValid: false, message: 'Invalid URL format' });
      return false;
    }

    // Test if URL is accessible
    try {
      setUrlValidation({ isValid: null, message: 'Checking URL accessibility...' });
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status.http_code >= 200 && data.status.http_code < 400) {
        setUrlValidation({ isValid: true, message: 'URL is accessible!' });
        return true;
      } else {
        setUrlValidation({ isValid: false, message: `URL returned status: ${data.status.http_code}` });
        return false;
      }
    } catch (error) {
      setUrlValidation({ isValid: false, message: 'Could not verify URL accessibility (but URL format is valid)' });
      return true; // Allow saving even if we can't verify accessibility
    }
  };

  const handleUrlValidation = () => {
    if (form.h) {
      setShowUrlModal(true);
      validateUrl(form.h);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: Number(editId) }),
      })
        .then(res => res.json())
        .then(updated => {
          setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
          setEditId(null);
          setForm({ id: '', image: '', p: '', d: '', h: '' });
          setShowImageSelector(false);
        });
    } else {
      const newProject = { ...form, id: Date.now() };
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })
        .then(res => res.json())
        .then(p => {
          setProjects([...projects, p]);
          setForm({ id: '', image: '', p: '', d: '', h: '' });
          setShowImageSelector(false);
        });
    }
  };

  const handleEdit = project => {
    setEditId(project.id);
    setForm(project);
  };

  const handleDelete = id => {
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(() => setProjects(projects.filter(p => p.id !== id)));
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Projects</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Project Image:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <input name="image" placeholder="Image (e.g., assets/img/filename.png)" value={form.image} onChange={handleChange} required style={{ flex: 1 }} />
            <button type="button" onClick={() => setShowImageSelector(!showImageSelector)} style={{ padding: '5px 10px' }}>
              {showImageSelector ? 'Hide Images' : 'Browse Images'}
            </button>
          </div>
          {showImageSelector && (
            <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: 10, backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                {availableImages.map(imagePath => (
                  <div key={imagePath} style={{ textAlign: 'center', cursor: 'pointer', padding: 5, border: form.image === imagePath ? '2px solid #007bff' : '1px solid #ddd', backgroundColor: 'white' }} onClick={() => setForm({...form, image: imagePath})}>
                    <img src={`/public/${imagePath}`} alt="" style={{ width: 60, height: 40, objectFit: 'cover', marginBottom: 5 }} />
                    <div style={{ fontSize: 10, wordBreak: 'break-all' }}>{imagePath.split('/').pop()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {form.image && (
            <div style={{ marginTop: 5 }}>
              <img src={`/public/${form.image}`} alt="Preview" style={{ width: 100, height: 60, objectFit: 'cover', border: '1px solid #ccc' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Project Name:</label>
          <input 
            name="p" 
            placeholder="Project Name (short title)" 
            value={form.p} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Description:</label>
          <textarea 
            name="d" 
            placeholder="Detailed project description..." 
            value={form.d} 
            onChange={handleChange} 
            style={{ width: '100%', minHeight: 80, padding: '8px', resize: 'vertical', fontFamily: 'inherit' }} 
          />
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Project URL:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input 
              name="h" 
              type="url"
              placeholder="https://example.com" 
              value={form.h} 
              onChange={handleChange} 
              style={{ flex: 1, padding: '8px' }} 
            />
            <button 
              type="button" 
              onClick={handleUrlValidation}
              disabled={!form.h}
              style={{ 
                padding: '8px 12px', 
                backgroundColor: form.h ? '#007bff' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: form.h ? 'pointer' : 'not-allowed'
              }}
            >
              Validate URL
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            {editId ? 'Update' : 'Add'} Project
          </button>
          {editId && (
            <button 
              type="button" 
              onClick={() => { setEditId(null); setForm({ id: '', image: '', p: '', d: '', h: '' }); setShowImageSelector(false); }}
              style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* URL Validation Modal */}
      {showUrlModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: 30, 
            borderRadius: 8, 
            minWidth: 400,
            maxWidth: 500,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>URL Validation</h3>
            <div style={{ marginBottom: 15 }}>
              <strong>URL:</strong> <a href={form.h} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{form.h}</a>
            </div>
            <div style={{ 
              padding: 15, 
              borderRadius: 4, 
              marginBottom: 20,
              backgroundColor: urlValidation.isValid === true ? '#d4edda' : 
                             urlValidation.isValid === false ? '#f8d7da' : '#d1ecf1',
              border: `1px solid ${urlValidation.isValid === true ? '#c3e6cb' : 
                                  urlValidation.isValid === false ? '#f5c6cb' : '#bee5eb'}`,
              color: urlValidation.isValid === true ? '#155724' : 
                     urlValidation.isValid === false ? '#721c24' : '#0c5460'
            }}>
              <strong>Status:</strong> {urlValidation.message}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => validateUrl(form.h)} 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Recheck
              </button>
              <button 
                onClick={() => window.open(form.h, '_blank')} 
                disabled={!form.h}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: form.h ? 'pointer' : 'not-allowed',
                  opacity: form.h ? 1 : 0.5
                }}
              >
                Visit Site
              </button>
              <button 
                onClick={() => setShowUrlModal(false)} 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <table border="1" cellPadding="6" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Project URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td style={{ textAlign: 'center' }}>
                <img 
                  src={`/public/${p.image}`} 
                  alt={p.p || 'Project image'} 
                  style={{ width: 80, height: 50, objectFit: 'cover', border: '1px solid #ccc' }} 
                  onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA4MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjQwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'; }} 
                />
              </td>
              <td style={{ fontWeight: 'bold' }}>{p.p}</td>
              <td style={{ maxWidth: 200, wordWrap: 'break-word' }}>
                {p.d ? (p.d.length > 100 ? p.d.substring(0, 100) + '...' : p.d) : <em>No description</em>}
              </td>
              <td style={{ maxWidth: 150 }}>
                <div style={{ marginBottom: 5 }}>
                  <a href={p.h} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', fontSize: '0.9em' }}>
                    {p.h}
                  </a>
                </div>
                <button 
                  onClick={() => { setForm(p); setShowUrlModal(true); validateUrl(p.h); }}
                  style={{ 
                    padding: '2px 6px', 
                    fontSize: '0.8em', 
                    backgroundColor: '#17a2b8', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Check URL
                </button>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <button 
                    onClick={() => handleEdit(p)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#ffc107', 
                      color: 'black', 
                      border: 'none', 
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
