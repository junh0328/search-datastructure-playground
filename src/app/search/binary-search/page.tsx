'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchStep {
  left: number;
  right: number;
  mid: number;
  comparison: string;
  found?: boolean;
}

class BinarySearchArray {
  private array: number[];
  private steps: SearchStep[];

  constructor(initialArray: number[] = []) {
    this.array = [...initialArray].sort((a, b) => a - b);
    this.steps = [];
  }

  insert(value: number): void {
    this.array.push(value);
    this.array.sort((a, b) => a - b);
  }

  search(target: number): { found: boolean; index?: number; steps: SearchStep[] } {
    this.steps = [];
    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midValue = this.array[mid];

      const step: SearchStep = {
        left,
        right,
        mid,
        comparison: `array[${mid}] = ${midValue} vs target ${target}`
      };

      if (midValue === target) {
        step.found = true;
        this.steps.push(step);
        return { found: true, index: mid, steps: [...this.steps] };
      } else if (midValue < target) {
        step.comparison += ` → ${midValue} < ${target}, search right half`;
        left = mid + 1;
      } else {
        step.comparison += ` → ${midValue} > ${target}, search left half`;
        right = mid - 1;
      }

      this.steps.push(step);
    }

    return { found: false, steps: [...this.steps] };
  }

  getArray(): number[] {
    return [...this.array];
  }

  clear(): void {
    this.array = [];
    this.steps = [];
  }

  size(): number {
    return this.array.length;
  }
}

export default function BinarySearch() {
  const [binaryArray] = useState(new BinarySearchArray([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 23, 29, 31, 37, 41, 43, 47]));
  const [searchTarget, setSearchTarget] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [result, setResult] = useState<{ found: boolean; index?: number; steps: SearchStep[] } | null>(null);
  const [currentArray, setCurrentArray] = useState<number[]>(binaryArray.getArray());

  const handleSearch = () => {
    const target = parseInt(searchTarget.trim());
    if (isNaN(target)) return;
    
    const searchResult = binaryArray.search(target);
    setResult(searchResult);
  };

  const handleInsert = () => {
    const value = parseInt(insertValue.trim());
    if (isNaN(value)) return;
    
    binaryArray.insert(value);
    setCurrentArray(binaryArray.getArray());
    setInsertValue('');
  };

  const handleClear = () => {
    binaryArray.clear();
    setCurrentArray([]);
    setResult(null);
  };

  const ArrayVisualization = ({ array, searchSteps }: { array: number[], searchSteps?: SearchStep[] }) => {
    return (
      <div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px'}}>
          {array.map((value, index) => {
            let backgroundColor = '#f3f4f6';
            let textColor = '#374151';
            
            if (searchSteps && searchSteps.length > 0) {
              const lastStep = searchSteps[searchSteps.length - 1];
              if (lastStep.found && index === lastStep.mid) {
                backgroundColor = '#bbf7d0';
                textColor = '#15803d';
              } else if (index === lastStep.mid) {
                backgroundColor = '#bfdbfe';
                textColor = '#1e40af';
              } else if (index >= lastStep.left && index <= lastStep.right) {
                backgroundColor = '#fef3c7';
                textColor = '#92400e';
              }
            }

            return (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  backgroundColor,
                  color: textColor,
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                  minWidth: '60px'
                }}
              >
                <div style={{fontSize: '0.75rem', color: '#6b7280'}}>{index}</div>
                <div>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '1536px',
        margin: '0 auto'
      }}>
        <div style={{marginBottom: '24px'}}>
          <Link href="/" style={{
            color: '#3b82f6',
            textDecoration: 'none'
          }}>
            ← Back to Home
          </Link>
        </div>

        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '24px'
        }}>
          Binary Search
        </h1>

        {/* Algorithm Explanation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }}>알고리즘 설명</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <h3 style={{fontWeight: 'medium', color: '#374151', marginBottom: '8px'}}>시간 복잡도</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#4b5563'}}>
                <li style={{marginBottom: '4px'}}><strong>검색:</strong> O(log n) - 로그 시간</li>
                <li style={{marginBottom: '4px'}}><strong>삽입:</strong> O(n) - 정렬 유지 필요</li>
                <li style={{marginBottom: '4px'}}><strong>공간 복잡도:</strong> O(1) - 추가 공간 불필요</li>
              </ul>
            </div>
            <div>
              <h3 style={{fontWeight: 'medium', color: '#374151', marginBottom: '8px'}}>특징 및 이유</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#4b5563'}}>
                <li style={{marginBottom: '4px'}}>• 정렬된 배열에서만 사용 가능</li>
                <li style={{marginBottom: '4px'}}>• 매번 검색 범위를 절반으로 줄임</li>
                <li style={{marginBottom: '4px'}}>• 분할 정복(Divide and Conquer) 알고리즘</li>
                <li style={{marginBottom: '4px'}}>• 대용량 데이터에서 매우 효율적</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {/* Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>검색</h3>
              <div style={{display: 'flex', gap: '8px'}}>
                <input
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  placeholder="검색할 숫자를 입력하세요"
                  style={{
                    flex: '1',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
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
                    cursor: 'pointer'
                  }}
                >
                  검색
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>숫자 추가</h3>
              <div style={{display: 'flex', gap: '8px'}}>
                <input
                  type="number"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  placeholder="숫자"
                  style={{
                    flex: '1',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleInsert}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
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
                    cursor: 'pointer'
                  }}
                >
                  초기화
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>검색 결과</h3>
                <div style={{
                  padding: '16px',
                  borderRadius: '6px',
                  backgroundColor: result.found ? '#f0fdf4' : '#fef2f2',
                  border: result.found ? '1px solid #bbf7d0' : '1px solid #fecaca'
                }}>
                  {result.found ? (
                    <div>
                      <p style={{color: '#15803d', fontWeight: 'medium'}}>✓ 찾음!</p>
                      <p style={{fontSize: '0.875rem', color: '#16a34a'}}>인덱스: {result.index}</p>
                      <p style={{fontSize: '0.875rem', color: '#16a34a'}}>단계: {result.steps.length}</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{color: '#dc2626', fontWeight: 'medium'}}>✗ 찾을 수 없음</p>
                      <p style={{fontSize: '0.875rem', color: '#dc2626'}}>단계: {result.steps.length}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Visualization */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                정렬된 배열 (총 {currentArray.length}개)
              </h3>
              <ArrayVisualization array={currentArray} searchSteps={result?.steps} />
              <div style={{
                marginTop: '16px',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginRight: '16px'
                }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #e5e7eb',
                    marginRight: '8px'
                  }}></span>검색 범위
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginRight: '16px'
                }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#bfdbfe',
                    border: '1px solid #e5e7eb',
                    marginRight: '8px'
                  }}></span>중간값
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#bbf7d0',
                    border: '1px solid #e5e7eb',
                    marginRight: '8px'
                  }}></span>찾은 값
                </span>
              </div>
            </div>

            {result && result.steps.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>검색 단계</h3>
                <div style={{
                  maxHeight: '256px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {result.steps.map((step: SearchStep, index: number) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        borderLeft: step.found ? '4px solid #10b981' : '4px solid #3b82f6',
                        backgroundColor: step.found ? '#f0fdf4' : '#eff6ff'
                      }}
                    >
                      <div style={{fontWeight: 'medium'}}>단계 {index + 1}</div>
                      <div style={{fontSize: '0.75rem', color: '#6b7280'}}>
                        범위: [{step.left}, {step.right}], 중간: {step.mid}
                      </div>
                      <div>{step.comparison}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}