import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';

const CourseraCourses = () => {
  const arabicRegex = /[\u0600-\u06FF]/;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const filteredCourses = courses
    .filter(course => course.name && !arabicRegex.test(course.name))
    .slice(0, 10);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const apiUrl = 'https://api.coursera.org/api/courses.v1?limit=20&sort=recent';
        const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent(apiUrl);
        
        const res = await fetch(url);
        const data = await res.json();
        const parsed = JSON.parse(data.contents);

        if (parsed?.elements) {
          setCourses(parsed.elements);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="modern-courses-section">
      <h2 className="section-title">
        <span className="icon">🎓</span> Formations récentes sur Coursera
      </h2>
      
      {isLoading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <span>Chargement des cours...</span>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="modern-course-list">
          {filteredCourses.map((course) => (
            <div key={course.id} className="modern-course-card">
              <div className="course-content">
                <h3 className="course-title">{course.name}</h3>
                <a
                  href={`https://www.coursera.org/learn/${course.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-link"
                >
                  Voir la formation <FaExternalLinkAlt />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-courses-message">Aucun cours disponible pour le moment.</p>
      )}

      <style jsx>{`
        .modern-courses-section {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .section-title {
          text-align: center;
          color: #2d3748;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .section-title .icon {
          font-size: 1.5em;
        }
        
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #4a5568;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .modern-course-list {
          display: grid;
          gap: 1rem;
        }
        
        .modern-course-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        
        .modern-course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .course-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .course-title {
          margin: 0;
          color: #1a202c;
          font-size: 1.1rem;
          flex: 1;
        }
        
        .course-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #007b8f;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .course-link:hover {
          background: #00b4d8;
          transform: translateX(3px);
        }
        
        .no-courses-message {
          text-align: center;
          color: #718096;
        }
        
        @media (max-width: 768px) {
          .course-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .course-link {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseraCourses;