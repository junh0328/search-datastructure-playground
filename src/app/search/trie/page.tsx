'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  word?: string;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  private root: TrieNode;
  private operations: string[];

  constructor() {
    this.root = new TrieNode();
    this.operations = [];
  }

  insert(word: string): void {
    let current = this.root;
    this.operations.push(`INSERT: "${word}"`);

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();

      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
        this.operations.push(`  Created node for '${char}'`);
      } else {
        this.operations.push(`  Found existing node for '${char}'`);
      }

      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    current.word = word;
    this.operations.push(`  Marked end of word: "${word}"`);
  }

  search(word: string): { found: boolean; steps: number } {
    let current = this.root;
    this.operations.push(`SEARCH: "${word}"`);
    let steps = 0;

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      steps++;

      if (!current.children.has(char)) {
        this.operations.push(`  '${char}' not found at step ${steps}`);
        return { found: false, steps };
      }

      this.operations.push(`  Found '${char}' at step ${steps}`);
      current = current.children.get(char)!;
    }

    const found = current.isEndOfWord;
    this.operations.push(
      `  ${
        found ? 'Complete word found' : 'Prefix found but not complete word'
      }`
    );
    return { found, steps };
  }

  autocomplete(prefix: string, maxResults: number = 10): string[] {
    let current = this.root;
    this.operations.push(`AUTOCOMPLETE: "${prefix}"`);

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toLowerCase();

      if (!current.children.has(char)) {
        this.operations.push(`  Prefix "${prefix}" not found`);
        return [];
      }

      current = current.children.get(char)!;
    }

    const results: string[] = [];
    this._collectWords(current, results, maxResults);

    this.operations.push(`  Found ${results.length} suggestions`);
    return results;
  }

  private _collectWords(
    node: TrieNode,
    results: string[],
    maxResults: number
  ): void {
    if (results.length >= maxResults) return;

    if (node.isEndOfWord && node.word) {
      results.push(node.word);
    }

    for (const [, childNode] of node.children) {
      this._collectWords(childNode, results, maxResults);
    }
  }

  getOperations(): string[] {
    return [...this.operations];
  }

  clear(): void {
    this.root = new TrieNode();
    this.operations = [];
  }

  getAllWords(): string[] {
    const words: string[] = [];
    this._collectWords(this.root, words, 1000);
    return words;
  }
}

const sampleWords = [
  'apple',
  'application',
  'apply',
  'appreciate',
  'approach',
  'banana',
  'band',
  'bank',
  'banner',
  'base',
  'cat',
  'car',
  'card',
  'care',
  'career',
  'careful',
  'dog',
  'door',
  'down',
  'download',
  'development',
  'elephant',
  'email',
  'example',
  'excellent',
  'experience',
];

export default function TrieSearch() {
  const [trie] = useState(new Trie());
  const [searchTerm, setSearchTerm] = useState('');
  const [insertWord, setInsertWord] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    steps: number;
  } | null>(null);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<string[]>([]);

  useEffect(() => {
    console.log('### operations:', operations);
  }, [operations]);

  useEffect(() => {
    sampleWords.forEach((word) => trie.insert(word));
    setOperations(trie.getOperations());
    setAllWords(trie.getAllWords());
  }, [trie]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const searchResult = trie.search(searchTerm.trim());
    setResult(searchResult);
    setOperations(trie.getOperations());
  };

  const handleAutocomplete = (prefix: string) => {
    if (!prefix.trim()) {
      setAutocompleteResults([]);
      return;
    }

    const suggestions = trie.autocomplete(prefix.trim());
    setAutocompleteResults(suggestions);
    setOperations(trie.getOperations());
  };

  const handleInsert = () => {
    if (!insertWord.trim()) return;

    trie.insert(insertWord.trim());
    setOperations(trie.getOperations());
    setAllWords(trie.getAllWords());
    setInsertWord('');
  };

  const handleClear = () => {
    trie.clear();
    setOperations([]);
    setResult(null);
    setAutocompleteResults([]);
    setAllWords([]);
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
          Trie (Prefix Tree) - Autocomplete
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
                  <strong>검색:</strong> O(m) - m은 검색어 길이
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>삽입:</strong> O(m) - m은 단어 길이
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>자동완성:</strong> O(m + n) - n은 결과 개수
                </li>
                <li style={{ marginBottom: '4px' }}>
                  <strong>공간 복잡도:</strong> O(총 문자 수)
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
                  • 트리 구조로 공통 접두사 공유
                </li>
                <li style={{ marginBottom: '4px' }}>
                  • 메모리 효율적 (접두사 중복 제거)
                </li>
                <li style={{ marginBottom: '4px' }}>
                  • 자동완성과 철자 검사에 최적화
                </li>
                <li style={{ marginBottom: '4px' }}>
                  • 사전, 검색엔진 등에 널리 사용
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
                정확한 검색
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='완전한 단어를 검색하세요'
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
                자동완성
              </h3>
              <input
                type='text'
                placeholder='접두사를 입력하세요 (예: ap, ca, do)'
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                }}
                onChange={(e) => handleAutocomplete(e.target.value)}
              />
              {autocompleteResults.length > 0 && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 'medium',
                      color: '#374151',
                      marginBottom: '8px',
                    }}
                  >
                    자동완성 결과 ({autocompleteResults.length}개):
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {autocompleteResults.map((word, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#e9d5ff',
                          color: '#7c3aed',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                단어 추가
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type='text'
                  value={insertWord}
                  onChange={(e) => setInsertWord(e.target.value)}
                  placeholder='새 단어'
                  style={{
                    flex: '1',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
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

            {/* Search Result */}
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
                        ✓ 완전한 단어 찾음!
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#16a34a' }}>
                        단계: {result.steps}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#dc2626', fontWeight: 'medium' }}>
                        ✗ 완전한 단어 없음
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
                저장된 단어들 (총 {allWords.length}개)
              </h3>
              <div
                style={{
                  maxHeight: '192px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {allWords.map((word, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {word}
                  </span>
                ))}
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
                연산 기록
              </h3>
              <div
                style={{
                  maxHeight: '256px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {operations.slice(-20).map((op, index) => {
                  let bgColor = '#f9fafb';
                  let textColor = '#4b5563';

                  if (op.startsWith('INSERT')) {
                    bgColor = '#f0fdf4';
                    textColor = '#15803d';
                  } else if (op.startsWith('SEARCH')) {
                    bgColor = '#eff6ff';
                    textColor = '#1d4ed8';
                  } else if (op.startsWith('AUTOCOMPLETE')) {
                    bgColor = '#faf5ff';
                    textColor = '#7c3aed';
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
    </div>
  );
}
