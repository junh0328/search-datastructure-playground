'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '48px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#111827',
            marginBottom: '8px',
          }}
        >
          Search Data Structure Playground
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            textAlign: 'center',
            color: '#4b5563',
            marginBottom: '48px',
          }}
        >
          Explore different search algorithms with interactive examples
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Exact Match Search */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
              }}
            >
              완전 일치 검색 (Exact Match)
            </h2>
            <p
              style={{
                color: '#4b5563',
                marginBottom: '24px',
              }}
            >
              정확히 일치하는 값을 찾는 검색 알고리즘들
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Link
                href='/search/hash-table'
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
              >
                Hash Table Search
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    opacity: '0.8',
                    color: '#dbeafe',
                  }}
                >
                  O(1) average case
                </span>
              </Link>
              <Link
                href='/search/binary-search'
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
              >
                Binary Search
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    opacity: '0.8',
                    color: '#d1fae5',
                  }}
                >
                  O(log n)
                </span>
              </Link>
            </div>
          </div>

          {/* Text Search */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
              }}
            >
              텍스트 검색 (Text Search)
            </h2>
            <p
              style={{
                color: '#4b5563',
                marginBottom: '24px',
              }}
            >
              부분 일치와 자동 완성을 위한 검색 알고리즘들
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Link
                href='/search/trie'
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
              >
                Trie (Prefix Tree)
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    opacity: '0.8',
                    color: '#e9d5ff',
                  }}
                >
                  O(m) for autocomplete
                </span>
              </Link>
              <Link
                href='/search/substring'
                style={{
                  boxSizing: 'border-box',
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f97316',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
              >
                Substring Matching
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    opacity: '0.8',
                    color: '#fed7aa',
                  }}
                >
                  O(n×m) linear search
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
