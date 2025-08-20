'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchMatch {
  text: string;
  index: number;
  pattern: string;
  matchLength: number;
}

class SubstringSearcher {
  private texts: string[];
  private operations: string[];

  constructor(initialTexts: string[] = []) {
    this.texts = [...initialTexts];
    this.operations = [];
  }

  addText(text: string): void {
    this.texts.push(text);
  }

  naiveSearch(pattern: string): { matches: SearchMatch[]; totalComparisons: number } {
    this.operations = [];
    const matches: SearchMatch[] = [];
    let totalComparisons = 0;

    this.operations.push(`NAIVE SEARCH: Looking for "${pattern}"`);

    for (let textIndex = 0; textIndex < this.texts.length; textIndex++) {
      const text = this.texts[textIndex];
      this.operations.push(`Searching in text ${textIndex + 1}: "${text}"`);

      for (let i = 0; i <= text.length - pattern.length; i++) {
        let j = 0;
        
        while (j < pattern.length && text[i + j] === pattern[j]) {
          totalComparisons++;
          j++;
        }

        if (j < pattern.length) {
          totalComparisons++;
        }

        if (j === pattern.length) {
          const match: SearchMatch = {
            text: text,
            index: i,
            pattern: pattern,
            matchLength: pattern.length
          };
          matches.push(match);
          this.operations.push(`  FOUND at position ${i}: "${text.substring(i, i + pattern.length)}"`);
        }
      }
    }

    this.operations.push(`Total matches: ${matches.length}, Total comparisons: ${totalComparisons}`);
    return { matches, totalComparisons };
  }

  kmpSearch(pattern: string): { matches: SearchMatch[]; totalComparisons: number; lpsArray: number[] } {
    this.operations = [];
    const matches: SearchMatch[] = [];
    let totalComparisons = 0;

    const lps = this.buildLPS(pattern);
    this.operations.push(`KMP SEARCH: Pattern "${pattern}"`);
    this.operations.push(`LPS Array: [${lps.join(', ')}]`);

    for (let textIndex = 0; textIndex < this.texts.length; textIndex++) {
      const text = this.texts[textIndex];
      this.operations.push(`Searching in text ${textIndex + 1}: "${text}"`);

      let i = 0;
      let j = 0;

      while (i < text.length) {
        totalComparisons++;
        
        if (text[i] === pattern[j]) {
          this.operations.push(`  Match: text[${i}]='${text[i]}' = pattern[${j}]='${pattern[j]}'`);
          i++;
          j++;
        }

        if (j === pattern.length) {
          const match: SearchMatch = {
            text: text,
            index: i - j,
            pattern: pattern,
            matchLength: pattern.length
          };
          matches.push(match);
          this.operations.push(`  FOUND at position ${i - j}`);
          j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
          this.operations.push(`  Mismatch: text[${i}]='${text[i]}' ≠ pattern[${j}]='${pattern[j]}'`);
          if (j !== 0) {
            j = lps[j - 1];
            this.operations.push(`  Using LPS: jump to pattern[${j}]`);
          } else {
            i++;
          }
        }
      }
    }

    this.operations.push(`Total matches: ${matches.length}, Total comparisons: ${totalComparisons}`);
    return { matches, totalComparisons, lpsArray: lps };
  }

  private buildLPS(pattern: string): number[] {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  getOperations(): string[] {
    return [...this.operations];
  }

  getTexts(): string[] {
    return [...this.texts];
  }

  clear(): void {
    this.texts = [];
    this.operations = [];
  }
}

export default function SubstringSearch() {
  const [searcher] = useState(new SubstringSearcher([
    'Hello world, this is a wonderful world!',
    'JavaScript programming is fun and rewarding',
    'Data structures and algorithms are important',
    'The quick brown fox jumps over the lazy dog',
    'Machine learning and artificial intelligence'
  ]));
  
  const [searchPattern, setSearchPattern] = useState('');
  const [newText, setNewText] = useState('');
  const [naiveResult, setNaiveResult] = useState<{ matches: SearchMatch[]; totalComparisons: number } | null>(null);
  const [kmpResult, setKmpResult] = useState<{ matches: SearchMatch[]; totalComparisons: number; lpsArray: number[] } | null>(null);
  const [operations, setOperations] = useState<string[]>([]);
  const [texts, setTexts] = useState<string[]>(searcher.getTexts());
  const [activeAlgorithm, setActiveAlgorithm] = useState<'naive' | 'kmp'>('naive');

  const handleNaiveSearch = () => {
    if (!searchPattern.trim()) return;
    
    const result = searcher.naiveSearch(searchPattern.trim());
    setNaiveResult(result);
    setOperations(searcher.getOperations());
    setActiveAlgorithm('naive');
  };

  const handleKmpSearch = () => {
    if (!searchPattern.trim()) return;
    
    const result = searcher.kmpSearch(searchPattern.trim());
    setKmpResult(result);
    setOperations(searcher.getOperations());
    setActiveAlgorithm('kmp');
  };

  const handleAddText = () => {
    if (!newText.trim()) return;
    
    searcher.addText(newText.trim());
    setTexts(searcher.getTexts());
    setNewText('');
  };

  const handleClear = () => {
    searcher.clear();
    setTexts([]);
    setOperations([]);
    setNaiveResult(null);
    setKmpResult(null);
  };

  const highlightMatches = (text: string, matches: SearchMatch[], pattern: string) => {
    if (!matches.length) return text;
    
    const parts = [];
    let lastIndex = 0;
    
    matches
      .filter(match => match.text === text)
      .sort((a, b) => a.index - b.index)
      .forEach((match, i) => {
        parts.push(text.substring(lastIndex, match.index));
        parts.push(
          <span key={i} style={{backgroundColor: '#fef08a', fontWeight: 'bold'}}>
            {text.substring(match.index, match.index + pattern.length)}
          </span>
        );
        lastIndex = match.index + pattern.length;
      });
    
    parts.push(text.substring(lastIndex));
    return parts;
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
          Substring Matching
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
              <h3 style={{fontWeight: 'medium', color: '#374151', marginBottom: '8px'}}>Naive Search</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#4b5563'}}>
                <li style={{marginBottom: '4px'}}><strong>시간 복잡도:</strong> O(n×m)</li>
                <li style={{marginBottom: '4px'}}><strong>공간 복잡도:</strong> O(1)</li>
                <li style={{marginBottom: '4px'}}>• 가장 단순한 문자열 매칭</li>
                <li style={{marginBottom: '4px'}}>• 모든 위치에서 패턴과 비교</li>
              </ul>
            </div>
            <div>
              <h3 style={{fontWeight: 'medium', color: '#374151', marginBottom: '8px'}}>KMP Algorithm</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#4b5563'}}>
                <li style={{marginBottom: '4px'}}><strong>시간 복잡도:</strong> O(n + m)</li>
                <li style={{marginBottom: '4px'}}><strong>공간 복잡도:</strong> O(m)</li>
                <li style={{marginBottom: '4px'}}>• LPS 배열을 사용한 최적화</li>
                <li style={{marginBottom: '4px'}}>• 불필요한 비교를 건너뜀</li>
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
              }}>부분 문자열 검색</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <input
                  type="text"
                  value={searchPattern}
                  onChange={(e) => setSearchPattern(e.target.value)}
                  placeholder="검색할 패턴을 입력하세요"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    onClick={handleNaiveSearch}
                    style={{
                      flex: '1',
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Naive Search
                  </button>
                  <button
                    onClick={handleKmpSearch}
                    style={{
                      flex: '1',
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    KMP Search
                  </button>
                </div>
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
              }}>텍스트 추가</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="새로운 텍스트를 입력하세요"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    onClick={handleAddText}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#8b5cf6',
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
            </div>

            {/* Results */}
            {(naiveResult || kmpResult) && (
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
                {activeAlgorithm === 'naive' && naiveResult && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe'
                  }}>
                    <p style={{color: '#1e40af', fontWeight: 'medium'}}>Naive Search</p>
                    <p style={{fontSize: '0.875rem', color: '#3b82f6'}}>
                      매치: {naiveResult.matches.length}개, 비교 횟수: {naiveResult.totalComparisons}
                    </p>
                  </div>
                )}
                {activeAlgorithm === 'kmp' && kmpResult && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0'
                  }}>
                    <p style={{color: '#15803d', fontWeight: 'medium'}}>KMP Search</p>
                    <p style={{fontSize: '0.875rem', color: '#16a34a'}}>
                      매치: {kmpResult.matches.length}개, 비교 횟수: {kmpResult.totalComparisons}
                    </p>
                    <p style={{fontSize: '0.875rem', color: '#16a34a'}}>
                      LPS 배열: [{kmpResult.lpsArray.join(', ')}]
                    </p>
                  </div>
                )}
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
                텍스트 목록 (총 {texts.length}개)
              </h3>
              <div style={{
                maxHeight: '256px',
                overflowY: 'auto'
              }}>
                {texts.map((text, index) => {
                  const currentResult = activeAlgorithm === 'naive' ? naiveResult : kmpResult;
                  return (
                    <div key={index} style={{
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>텍스트 {index + 1}:</div>
                      <div>
                        {currentResult?.matches && searchPattern ? 
                          highlightMatches(text, currentResult.matches, searchPattern) : 
                          text
                        }
                      </div>
                    </div>
                  );
                })}
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
              }}>알고리즘 실행 과정</h3>
              <div style={{
                maxHeight: '256px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {operations.map((op, index) => {
                  let bgColor = '#f9fafb';
                  let textColor = '#374151';
                  
                  if (op.includes('FOUND')) {
                    bgColor = '#f0fdf4';
                    textColor = '#15803d';
                  } else if (op.includes('Match:')) {
                    bgColor = '#eff6ff';
                    textColor = '#1d4ed8';
                  } else if (op.includes('Mismatch:')) {
                    bgColor = '#fef2f2';
                    textColor = '#dc2626';
                  } else if (op.includes('LPS')) {
                    bgColor = '#faf5ff';
                    textColor = '#7c3aed';
                  }
                  
                  return (
                    <div key={index} style={{
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      backgroundColor: bgColor,
                      color: textColor
                    }}>
                      {op}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}