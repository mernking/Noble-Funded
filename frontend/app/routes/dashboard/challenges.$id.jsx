import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, Copy, Eye, EyeOff, TrendingUp, Shield, Clock, RefreshCw } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { api } from '@/lib/api.js'
import 'react-toastify/dist/ReactToastify.css'

export default function ChallengeDetail() {
  const { id } = useParams()
  const [challenge, setChallenge] = useState(null)
  const [stats, setStats] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        api.get(`challenges/${id}`),
        api.get(`challenges/${id}/stats`),
      ])
      setChallenge(cRes.data)
      setStats(sRes.data)
    } catch (err) {
      toast.error('Failed to load challenge data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied to clipboard.`))
  }

  if (loading) return <div style={{ color: '#7a8fa6', textAlign: 'center', padding: '4rem' }}>Loading challenge…</div>
  if (!challenge) return <div style={{ color: '#7a8fa6', textAlign: 'center', padding: '4rem' }}>Challenge not found.</div>

  const currency = challenge.accountType === 'naira' ? '₦' : '$'
  const startBal = Number(challenge.startingBalance)
  const curBal = Number(challenge.currentBalance)
  const target = Number(challenge.profitTarget)
  const profitPct = ((curBal - startBal) / startBal * 100).toFixed(1)
  const progressPct = Math.min(((curBal - startBal) / (target - startBal)) * 100, 100)
  const drawdownLimit = challenge.maxDrawdownPct
  const drawdown = 0 // TODO: from MT5

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/dashboard/challenges" style={{ display: 'flex', alignItems: 'center', color: '#7a8fa6', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} style={{ marginRight: '0.35rem' }} /> Back
        </Link>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#f0f4ff' }}>
          {currency}{startBal.toLocaleString()} {challenge.accountType.toUpperCase()} Challenge
        </h1>
        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: challenge.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(96,165,250,0.1)', color: challenge.status === 'active' ? '#22c55e' : '#60a5fa', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {challenge.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Account Stats */}
        <div style={{ background: '#0d1421', borderRadius: '16px', border: '1px solid #1e2f4a', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#f0f4ff', fontSize: '1rem', fontWeight: 700 }}>Account Stats</h2>
            <button onClick={load} style={{ background: '#111b2e', border: '1px solid #1e2f4a', borderRadius: '8px', padding: '0.35rem', color: '#7a8fa6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <RefreshCw size={14} />
            </button>
          </div>
          {[
            ['Starting Balance', `${currency}${startBal.toLocaleString()}`],
            ['Current Balance', `${currency}${curBal.toLocaleString()}`],
            ['Profit Target', `${currency}${target.toLocaleString()}`],
            ['Profit / Loss', `${profitPct > 0 ? '+' : ''}${profitPct}%`, profitPct > 0 ? '#22c55e' : '#ef4444'],
          ].map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #1e2f4a', fontSize: '0.875rem' }}>
              <span style={{ color: '#7a8fa6' }}>{k}</span>
              <span style={{ color: c || '#f0f4ff', fontWeight: 700 }}>{v}</span>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ color: '#7a8fa6', fontSize: '0.78rem' }}>Progress to target</span>
              <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.78rem' }}>{Math.max(0, progressPct).toFixed(1)}%</span>
            </div>
            <div style={{ height: '8px', background: '#1e2f4a', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.max(0, progressPct)}%`, background: 'linear-gradient(90deg, #c9a84c, #f0c96a)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Rules Compliance */}
        <div style={{ background: '#0d1421', borderRadius: '16px', border: '1px solid #1e2f4a', padding: '1.5rem' }}>
          <h2 style={{ color: '#f0f4ff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Rules Compliance</h2>
          {[
            { label: 'Max Drawdown', current: drawdown, limit: drawdownLimit, safe: drawdown < drawdownLimit * 0.8 },
            { label: 'Daily Loss Limit', current: 0, limit: Number(challenge.maxDailyLossPct), safe: true },
          ].map(({ label, current, limit, safe }) => {
            const pct = (current / limit) * 100
            return (
              <div key={label} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#7a8fa6', fontSize: '0.85rem' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 600 }}>{current.toFixed(2)}% / {limit}%</span>
                    <Shield size={14} color={safe ? '#22c55e' : '#ef4444'} />
                  </div>
                </div>
                <div style={{ height: '6px', background: '#1e2f4a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: safe ? '#22c55e' : '#ef4444', borderRadius: '3px' }} />
                </div>
              </div>
            )
          })}
          <div style={{ background: '#111b2e', borderRadius: '8px', padding: '0.875rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: '#7a8fa6', fontSize: '0.8rem' }}>Duration</span>
              <span style={{ color: '#f0f4ff', fontSize: '0.8rem', fontWeight: 600 }}>
                {challenge.durationDays} day{challenge.durationDays !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ color: '#7a8fa6', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Started: {challenge.startedAt ? new Date(challenge.startedAt).toLocaleDateString() : 'Not started'}
            </div>
          </div>
        </div>

        {/* MT5 Credentials */}
        <div style={{ background: '#0d1421', borderRadius: '16px', border: '1px solid #1e2f4a', padding: '1.5rem' }}>
          <h2 style={{ color: '#f0f4ff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#c9a84c" /> MT5 Credentials
          </h2>
          {challenge.mt5Login ? (
            <>
              {[
                { label: 'Login', value: challenge.mt5Login },
                { label: 'Server', value: challenge.mt5Server },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111b2e', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.625rem' }}>
                  <div>
                    <div style={{ color: '#7a8fa6', fontSize: '0.72rem', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.875rem' }}>{value}</div>
                  </div>
                  <button onClick={() => copyToClipboard(value, label)} style={{ background: '#1e2f4a', border: 'none', borderRadius: '6px', padding: '0.35rem', color: '#7a8fa6', cursor: 'pointer' }}>
                    <Copy size={14} />
                  </button>
                </div>
              ))}
              <div style={{ background: '#111b2e', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#7a8fa6', fontSize: '0.72rem', marginBottom: '0.2rem' }}>Password</div>
                  <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.875rem' }}>{showPassword ? challenge.mt5Password : '••••••••'}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button onClick={() => setShowPassword(!showPassword)} style={{ background: '#1e2f4a', border: 'none', borderRadius: '6px', padding: '0.35rem', color: '#7a8fa6', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => copyToClipboard(challenge.mt5Password, 'Password')} style={{ background: '#1e2f4a', border: 'none', borderRadius: '6px', padding: '0.35rem', color: '#7a8fa6', cursor: 'pointer' }}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: '#7a8fa6', fontSize: '0.875rem', padding: '1rem 0', textAlign: 'center' }}>
              <Clock size={32} color="#1e2f4a" style={{ marginBottom: '0.75rem' }} />
              <p>Your MT5 account is being set up. You'll receive credentials via email shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
