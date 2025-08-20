'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

class HashTable {
  private table: Map<string, string>;
  private operations: string[];

  constructor() {
    this.table = new Map();
    this.operations = [];
  }

  insert(key: string, value: string): void {
    this.table.set(key, value);
    this.operations.push(`INSERT: ${key} -> ${value}`);
  }

  search(key: string): { found: boolean; value?: string; steps: number } {
    this.operations.push(`SEARCH: Looking for "${key}"`);

    if (this.table.has(key)) {
      const value = this.table.get(key);
      this.operations.push(`FOUND: "${key}" -> ${value}`);
      return { found: true, value, steps: 1 };
    } else {
      this.operations.push(`NOT FOUND: "${key}"`);
      return { found: false, steps: 1 };
    }
  }

  getOperations(): string[] {
    return [...this.operations];
  }

  clear(): void {
    this.table.clear();
    this.operations = [];
  }

  size(): number {
    return this.table.size;
  }
}

export default function HashTableSearch() {
  const [hashTable] = useState(new HashTable());
  const [searchTerm, setSearchTerm] = useState('');
  const [insertKey, setInsertKey] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    value?: string;
    steps: number;
  } | null>(null);
  const [operations, setOperations] = useState<string[]>([]);

  // Initialize with sample data
  useEffect(() => {
    // Only initialize if the hash table is empty
    if (hashTable.size() === 0) {
      hashTable.insert('apple', '사과');
      hashTable.insert('banana', '바나나');
      hashTable.insert('cherry', '체리');
      hashTable.insert('date', '대추야자');
      hashTable.insert('elderberry', '엘더베리');

      setOperations(hashTable.getOperations());
    }
  }, [hashTable]);

  useEffect(() => {
    console.log('### operations changed', operations);
  }, [operations]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const searchResult = hashTable.search(searchTerm.trim());
    setResult(searchResult);
    setOperations(hashTable.getOperations());
  };

  const handleInsert = () => {
    if (!insertKey.trim() || !insertValue.trim()) return;

    hashTable.insert(insertKey.trim(), insertValue.trim());
    setOperations(hashTable.getOperations());
    setInsertKey('');
    setInsertValue('');
  };

  const handleClear = () => {
    hashTable.clear();
    setOperations([]);
    setResult(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1536px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Link
            href='/'
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
          }}
        >
          Hash Table Search
        </h1>

        {/* Algorithm Explanation */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px',
            }}
          >
            알고리즘 설명
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            <div>
              <h3
                style={{
                  fontWeight: 'medium',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                시간 복잡도
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#4b5563',
                }}
              >
                <li style={{ marginBottom: '4px' }}>
                  <strong>평균:</strong> O(1) - 상수 시간
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>최악:</strong> O(n) - 모든 키가 같은 해시값을 가질 때
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>삽입:</strong> O(1) 평균
                </li>
              </ul>
            </div>
            <div>
              <h3
                style={{
                  fontWeight: 'medium',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                특징 및 이유
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#4b5563',
                }}
              >
                <li style={{ marginBottom: '4px' }}>
                  • 해시 함수를 사용해 키를 배열 인덱스로 변환
                </li>
                <li style={{ marginBottom: '4px' }}>
                  • 키-값 쌍을 직접 접근 가능
                </li>
                <li style={{ marginBottom: '4px' }}>• 메모리 사용량: O(n)</li>
                <li style={{ marginBottom: '4px' }}>
                  • 완전 일치 검색에 최적화
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px',
                }}
              >
                검색
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='검색할 키를 입력하세요'
                  style={{
                    flex: '1',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  검색
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px',
                }}
              >
                데이터 추가
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <input
                  type='text'
                  value={insertKey}
                  onChange={(e) => setInsertKey(e.target.value)}
                  placeholder='키'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
                <input
                  type='text'
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  placeholder='값'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleInsert}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    추가
                  </button>
                  <button
                    onClick={handleClear}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    초기화
                  </button>
                </div>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '16px',
                  }}
                >
                  검색 결과
                </h3>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '6px',
                    backgroundColor: result.found ? '#f0fdf4' : '#fef2f2',
                    border: result.found
                      ? '1px solid #bbf7d0'
                      : '1px solid #fecaca',
                  }}
                >
                  {result.found ? (
                    <div>
                      <p style={{ color: '#15803d', fontWeight: 'medium' }}>
                        ✓ 찾음!
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#16a34a' }}>
                        값: {result.value}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#16a34a' }}>
                        단계: {result.steps}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#dc2626', fontWeight: 'medium' }}>
                        ✗ 찾을 수 없음
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                        단계: {result.steps}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Visualization */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
              }}
            >
              연산 기록 (총 {hashTable.size()}개 항목)
            </h3>
            <div
              style={{
                maxHeight: '384px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {operations.map((op, index) => {
                let bgColor = '#f9fafb';
                let textColor = '#374151';

                if (op.startsWith('INSERT')) {
                  bgColor = '#f0fdf4';
                  textColor = '#15803d';
                } else if (op.startsWith('FOUND')) {
                  bgColor = '#eff6ff';
                  textColor = '#1d4ed8';
                } else if (op.startsWith('NOT FOUND')) {
                  bgColor = '#fef2f2';
                  textColor = '#dc2626';
                }

                return (
                  <div
                    key={index}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {op}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
